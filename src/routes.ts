import { loadQuery } from "react-relay/hooks";
import Root from "./components/Root";
import {
  ComposersSearchView,
  InitialQuery as ComposersSearchViewInitialQuery,
} from "./components/ComposersSearchView";
import ComposerView, { Query as ComposerViewQuery } from "./components/ComposerView";
import ComposerViewDefault, {
  Query as ComposerViewDefaultQuery,
} from "./components/ComposerViewDefault";
import ComposerViewWork, {
  Query as ComposerViewWorkQuery,
} from "./components/ComposerViewWork";
import ComposerViewBio, {
  Query as ComposerViewBioQuery,
} from "./components/ComposerViewBio";

// types
import { IEnvironment } from "relay-runtime";

const getRoutes = (relayEnv: IEnvironment) => [
  {
    path: undefined,
    component: Root,
    prepare: () => {},
    routes: [
      {
        path: "/",
        exact: true,
        component: ComposersSearchView,
        prepare: () => {
          return {
            initialQueryRef: loadQuery(relayEnv, ComposersSearchViewInitialQuery, {
              country: null,
              workKind: null,
            }),
          };
        },
      },
      {
        path: "/composer/:id",
        component: ComposerView,
        prepare: (params: { id: any }) => {
          console.log("ComposerView");
          return {
            queryRef: loadQuery(relayEnv, ComposerViewQuery, {
              composerId: params.id,
            }),
          };
        },
        routes: [
          {
            path: "/composer/:id/work/:workId",
            component: ComposerViewWork,
            prepare: (params: { workId: any }) => {
              console.log("ComposerViewWork");
              return {
                queryRef: loadQuery(relayEnv, ComposerViewWorkQuery, {
                  workId: params.workId,
                }),
              };
            },
          },
          {
            path: "/composer/:id/bio",
            component: ComposerViewBio,
            prepare: (params: { id: any }) => {
              console.log("ComposerViewBio");
              return {
                queryRef: loadQuery(relayEnv, ComposerViewBioQuery, {
                  composerId: params.id,
                }),
              };
            },
          },
          {
            path: "/composer/:id",
            component: ComposerViewDefault,
            prepare: (params: { id: any }) => {
              console.log("ComposerViewDefault");
              return {
                queryRef: loadQuery(relayEnv, ComposerViewDefaultQuery, {
                  composerId: params.id,
                }),
              };
            },
          },
        ],
      },
    ],
  },
];

export default getRoutes;
