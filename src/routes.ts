import { loadQuery } from "react-relay/hooks";
import Root from "./component/Root";
import HomeView from "./component/HomeView";
import {
  ComposersSearchView,
  InitialQuery as ComposersSearchViewInitialQuery,
} from "./component/ComposersSearchView";
import {
  ComposerDetailedView,
  Query as ComposerDetailedViewQuery,
} from "./component/ComposerDetailedView";
// types
import { IEnvironment } from "relay-runtime";

export const getRoutes = (relayEnv: IEnvironment) => [
  {
    component: Root,
    prepare: () => {},
    routes: [
      {
        path: "/",
        exact: true,
        component: HomeView,
        preload: () => {},
      },
      {
        path: "/composers",
        component: ComposersSearchView,
        preload: () => {
          return {
            query: loadQuery(relayEnv, ComposersSearchViewInitialQuery, {
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
