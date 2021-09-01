import * as rrc from "react-router-config";
import * as h from "history";
import type { PreloadedQuery } from "react-relay/hooks";
import type * as rr from "react-router";

type History = h.BrowserHistory<h.State>;
type Location = h.Location<h.State>;

type MatchEntry = {
  component: any;
  preloaded:
    | {
        query: PreloadedQuery<any, Record<string, unknown>>;
      }
    | null
    | undefined;
  routeData: rr.match<{}>;
};

export type Router = {
  history: History;
  get: () => {
    location: Location;
    entries: any;
  };
  preload: (pathname: string) => void;
  subscribe: (observer: any) => () => void;
};

type RouteTreeNode = {
  path?: string | undefined;
  exact?: boolean;
  component: any;
  preload?: (params: any) => { query: PreloadedQuery<any> } | undefined;
  routes?: RouteTree | undefined;
};

export type RouteTree = RouteTreeNode[];

/**
 * A custom router built from the same primitives as react-router. Each object in `routes`
 * contains both a Component and a preload() function that can preload data for the component.
 * The router watches for changes to the current location via the `history` package, maps the
 * location to the corresponding route entry, and then preloads the code and data for the route.
 */
export function createRouter(
  routes: RouteTree,
  options?: any
): { cleanupFn: () => void; context: Router } {
  const history = h.createBrowserHistory(options);

  // Find the initial match and preload it
  const initialMatches = matchRoute(routes, history.location);
  const initialEntries = preloadMatches$effect(initialMatches);

  const __state = {
    currentEntry: {
      location: history.location,
      entries: initialEntries,
    },
    nextId: 0,
    // maintain a set of subscribers to the active entry
    subscribers: new Map(),
  };

  // Listen for location changes, match to the route entry, prepare the entry,
  // and notify subscribers. Note that this pattern ensures that data-loading
  // occurs *outside* of - and *before* - rendering.
  const cleanupFn = history.listen(({ location }) => {
    if (location.pathname === __state.currentEntry.location.pathname) {
      return;
    }
    const matches = matchRoute(routes, location);
    const entries = preloadMatches$effect(matches);

    const nextEntry = {
      location,
      entries,
    };
    __state.currentEntry = nextEntry;
    __state.subscribers.forEach((observer) => observer(nextEntry));
  });

  // The actual object that will be passed on the RoutingContext.
  const context = {
    history,
    get() {
      return __state.currentEntry;
    },
    preload(pathname: string) {
      // preload data for a route, without storing the result
      const matches = rrc.matchRoutes(routes, pathname);
      preloadMatches$effect(matches);
    },
    subscribe(observer: any) {
      const id = __state.nextId++;
      __state.subscribers.set(id, observer);
      return () => {
        __state.subscribers.delete(id);
      };
    },
  };

  // Return both the context object and a cleanup function
  return { cleanupFn, context };
}

/**
 * Match the current location to the corresponding route entry.
 */
function matchRoute(routes: RouteTree, location: Location) {
  const matchedRoutes = rrc.matchRoutes(routes, location.pathname);
  if (!Array.isArray(matchedRoutes) || matchedRoutes.length === 0) {
    throw new Error("No route for " + location.pathname);
  }
  return matchedRoutes;
}

/**
 * Start loading the data for the matched route,
 * provided with params extracted from the route.
 */
function preloadMatches$effect(
  matches: rrc.MatchedRoute<{}, RouteTreeNode>[]
): MatchEntry[] {
  return matches.map((match) => {
    const { route, match: matchData } = match;
    const preloaded = route.preload ? route.preload(matchData.params) : null;
    return { component: route.component, preloaded, routeData: matchData };
  });
}
