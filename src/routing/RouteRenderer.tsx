import * as React from "react";
import { Suspense, useContext, useEffect, useState } from "react";
import RoutingContext from "./RoutingContext";
//types
import { ComponentType, ReactNode } from "react";
import { $Match } from "./createRouter";
import { Resource } from "../JSResource";

/**
 * The `component` property from the route entry is a Resource, which may or may not be ready.
 * We use a helper child component to unwrap the resource with component.read(), and then
 * render it if its ready.
 *
 * NOTE: calling routeEntry.route.component.read() directly in RouteRenderer wouldn't work the
 * way we'd expect. Because that method could throw - either suspending or on error - the error
 * would bubble up to the *caller* of RouteRenderer. We want the suspend/error to bubble up to
 * our ErrorBoundary/Suspense components, so we have to ensure that the suspend/error happens
 * in a child component.
 */
function RouteResourceComponent(props: {
  resource: Resource;
  prepared: any;
  routeData: $Match;
  children?: ReactNode;
}) {
  const Component = props.resource.read();
  const { children, routeData, prepared } = props;
  //@ts-ignore
  return React.createElement(Component, { routeData, prepared, children });
}

function RouteSimpleComponent(props: {
  component: ComponentType<{}>;
  routeData: $Match;
  children?: ReactNode;
}) {
  const { component, children, routeData } = props;
  //@ts-ignore
  return React.createElement(component, { routeData, children });
}

/**
 * A component that accesses the current route entry from RoutingContext and renders
 * that entry.
 */
export default function RouterRenderer() {
  // Access the router
  const router = useContext(RoutingContext);

  const [routeEntry, setRouteEntry] = useState(router.get());

  useEffect(() => {
    // Check if the route has changed between the last render and commit:
    const currentEntry = router.get();
    if (currentEntry !== routeEntry) {
      // if there was a concurrent modification, re-render and exit
      setRouteEntry(currentEntry);
      return;
    }

    // If there *wasn't* a concurrent change to the route, then the UI
    // is current: subscribe for subsequent route updates
    const dispose = router.subscribe((nextEntry: any) => {
      console.log(nextEntry);
      setRouteEntry(nextEntry);
    });
    return () => dispose();
  }, [router]);

  // The current route value is an array of matching entries - one entry per
  // level of routes (to allow nested routes). We have to map each one to a
  // RouteComponent to allow suspending, and also pass its children correctly.
  // Conceptually, we want this structure:
  // ```
  // <RouteComponent
  //   component={entry[0].component}
  //   prepared={entry[0].prepared}>
  //   <RouteComponent
  //     component={entry[1].component}
  //     prepared={entry[1].prepared}>
  //       // continue for nested items...
  //   </RouteComponent>
  // </RouteComponent>
  // ```
  // To achieve this, we reverse the list so we can start at the bottom-most
  // component, and iteratively construct parent components w the previous
  // value as the child of the next one:
  const reversedItems = ([] as typeof routeEntry.entries)
    .concat(routeEntry.entries)
    .reverse();
  const firstItem = reversedItems[0];

  // the bottom-most component is special since it will have no children
  // (though we could probably just pass null children to it)
  let routeComponent = firstItem.isResource ? (
    <RouteResourceComponent
      resource={firstItem.resource}
      prepared={firstItem.prepared}
      routeData={firstItem.routeData}
    />
  ) : (
    <RouteSimpleComponent
      component={firstItem.component}
      routeData={firstItem.routeData}
    />
  );

  for (let ii = 1; ii < reversedItems.length; ii++) {
    const nextItem = reversedItems[ii];
    routeComponent = nextItem.isResource ? (
      <RouteResourceComponent
        resource={nextItem.resource}
        prepared={nextItem.prepared}
        routeData={nextItem.routeData}
        children={routeComponent}
      />
    ) : (
      <RouteSimpleComponent
        component={nextItem.component}
        routeData={nextItem.routeData}
        children={routeComponent}
      />
    );
  }

  // Routes can error so wrap in an <ErrorBoundary>
  // Routes can suspend, so wrap in <Suspense>
  return <Suspense fallback={"Loading fallback..."}>{routeComponent}</Suspense>;
}
