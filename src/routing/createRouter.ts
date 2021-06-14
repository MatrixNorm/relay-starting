import { createBrowserHistory } from "history";
import * as rrc from "react-router-config";
import * as h from "history";

type $History = h.BrowserHistory<h.State>;
type $Location = h.Location<h.State>;

export type $Router = {
  history: $History;
  get: () => {
    location: $Location;
    entries: any;
  };
  preload: (pathname: string) => void;
  subscribe: (cb: any) => () => void;
};

/**
 * A custom router built from the same primitives as react-router. Each object in `routes`
 * contains both a Component and a prepare() function that can preload data for the component.
 * The router watches for changes to the current location via the `history` package, maps the
 * location to the corresponding route entry, and then preloads the code and data for the route.
 */
export function createRouter(
  routes: any,
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
function matchRoute(routes: any, location: any) {
  const matchedRoutes = rrc.matchRoutes(routes, location.pathname);
  if (!Array.isArray(matchedRoutes) || matchedRoutes.length === 0) {
    throw new Error("No route for " + location.pathname);
  }
  return matchedRoutes;
}

/** !!!
 * Load the data for the matched route, given the params extracted from the route
 */
function prepareMatches(matches: any) {
  return matches.map((match: any) => {
    const { route, match: matchData } = match;
    if (route.prepare) {
      const prepared = route.prepare(matchData.params);
      const Component = route.component.get();
      if (Component == null) {
        route.component.load();
      }
      return { component: route.component, prepared, routeData: matchData };
    }
    console.log(route);
    return { component: route.component, routeData: matchData };
  });
}
