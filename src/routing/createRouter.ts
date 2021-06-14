import { createBrowserHistory } from "history";
import * as rrc from "react-router-config";
import * as h from "history";
//types
import { Resource } from "../JSResource";
import { ComponentType } from "react";

type $History = h.BrowserHistory<h.State>;
type $Location = h.Location<h.State>;

type $Match = {
  params: any;
  isExact: boolean;
  path: string;
  url: string;
};

type $Entry =
  | {
      component: Resource;
      prepared: any;
      routeData: $Match;
    }
  | {
      component: ComponentType<{}>;
      routeData: $Match;
      prepared?: undefined;
    };

export type $Router = {
  history: $History;
  get: () => {
    location: $Location;
    entries: $Entry[];
  };
  preload: (pathname: string) => void;
  subscribe: (cb: any) => () => void;
};

export type RouteConfig = {
  path: string | undefined;
  exact?: boolean;
  resourceOrComponent: Resource | ComponentType;
  prepare?: (params: any) => any;
  routes?: RouteConfig[];
};

/**
 * A custom router built from the same primitives as react-router. Each object in `routes`
 * contains both a Component and a prepare() function that can preload data for the component.
 * The router watches for changes to the current location via the `history` package, maps the
 * location to the corresponding route entry, and then preloads the code and data for the route.
 */
export function createRouter(
  routes: RouteConfig[],
  options?: any
): { cleanup: () => void; context: $Router } {
  // Initialize history
  const history = createBrowserHistory(options);

  // Find the initial match and prepare it
  const initialMatches = matchRoute(routes, history.location);
  const initialEntries = prepareMatches(initialMatches);
  let currentEntry = {
    location: history.location,
    entries: initialEntries,
  };

  const __state = {
    nextId: 0,
    // maintain a set of subscribers to the active entry
    subscribers: new Map(),
  };

  // Listen for location changes, match to the route entry, prepare the entry,
  // and notify subscribers. Note that this pattern ensures that data-loading
  // occurs *outside* of - and *before* - rendering.
  const cleanup = history.listen(({ location }) => {
    if (location.pathname === currentEntry.location.pathname) {
      return;
    }
    const matches = matchRoute(routes, location);
    const entries = prepareMatches(matches);
    console.log("history.listen", entries);
    const nextEntry = {
      location,
      entries,
    };
    currentEntry = nextEntry;
    __state.subscribers.forEach((cb) => cb(nextEntry));
  });

  // The actual object that will be passed on the RoutingContext.
  const context = {
    history,
    get() {
      return currentEntry;
    },
    preload(pathname: string) {
      // !!!
      // preload data for a route, without storing the result
      const matches = rrc.matchRoutes(routes, pathname);
      prepareMatches(matches);
    },
    subscribe(cb: any) {
      const id = __state.nextId++;
      const dispose = () => {
        __state.subscribers.delete(id);
      };
      __state.subscribers.set(id, cb);
      return dispose;
    },
  };

  // Return both the context object and a cleanup function
  return { cleanup, context };
}

/**
 * Match the current location to the corresponding route entry.
 */
function matchRoute(routes: RouteConfig[], location: any) {
  const matchedRoutes = rrc.matchRoutes(routes, location.pathname);
  if (!Array.isArray(matchedRoutes) || matchedRoutes.length === 0) {
    throw new Error("No route for " + location.pathname);
  }
  return matchedRoutes;
}

/** !!!
 * Load the data for the matched route, given the params extracted from the route
 */
function prepareMatches(matches: rrc.MatchedRoute<{}, RouteConfig>[]) {
  return matches.map((match) => {
    const { route, match: matchData } = match;
    // ir lazy resource then load and prepare
    if (route.resourceOrComponent instanceof Resource) {
      const prepared = route.prepare ? route.prepare(matchData.params) : {};
      if (route.resourceOrComponent.get() == null) {
        route.resourceOrComponent.load();
      }
      return { component: route.resourceOrComponent, prepared, routeData: matchData };
    }
    // if simple React component then do nothing
    return { component: route.resourceOrComponent, routeData: matchData };
  });
}
