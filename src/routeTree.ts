import { loadQuery, PreloadedQuery } from "react-relay/hooks";
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
// types
import type { IEnvironment } from "relay-runtime";

type RouteTreeNode = {
  path?: string | undefined;
  exact?: boolean;
  component: any;
  preload?: (params: any) => { query: PreloadedQuery<any> } | undefined;
  routes?: RouteTree | undefined;
};

type RouteTree = RouteTreeNode[];

export const getRoutes = (relayEnv: IEnvironment): RouteTree => [
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
