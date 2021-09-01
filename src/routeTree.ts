import { loadQuery } from "react-relay/hooks";
import Header from "./component/Header";
import HomeView from "./component/HomeView";
import {
  ComposersBrowseView,
  InitialQuery as ComposersBrowseViewInitialQuery,
} from "./component/ComposersBrowseView";
import {
  ComposerDetailedView,
  Query as ComposerDetailedViewQuery,
} from "./component/ComposerDetailedView";

import type { IEnvironment } from "relay-runtime";
import type { RouteTree } from "./routing/Router";

export const getRouteTree = (relayEnv: IEnvironment): RouteTree => [
  {
    component: Header,
    routes: [
      {
        path: "/",
        exact: true,
        component: HomeView,
      },
      {
        path: "/composers",
        component: ComposersBrowseView,
        preload: () => {
          return {
            query: loadQuery(relayEnv, ComposersBrowseViewInitialQuery, {
              country: null,
              workKind: null,
            }),
          };
        },
      },
      {
        path: "/composer/:id",
        component: ComposerDetailedView,
        preload: (params: { id: string }) => {
          return {
            query: loadQuery(relayEnv, ComposerDetailedViewQuery, {
              composerId: params.id,
            }),
          };
        },
      },
    ],
  },
];
