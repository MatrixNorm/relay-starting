import { loadQuery } from "react-relay/hooks";
import JSResource from "./JSResource";
import Root from "./components/Root";
// types
import { IEnvironment } from "relay-runtime";

const getRoutes = (relayEnv: IEnvironment) => [
  {
    path: undefined,
    component: Root,
    routes: [
      {
        path: "/",
        exact: true,
        component: JSResource(
          "ComposersSearchView",
          () =>
            import(
              /* webpackChunkName: 'ComposersSearchView' */ "./components/ComposersSearchView"
            )
        ),
        prepare: () => {
          const query = require("__relay__/ComposersSearchViewInitialQuery.graphql");
          return {
            initialQueryRef: loadQuery(relayEnv, query, {
              country: null,
              workKind: null,
            }),
          };
        },
      },
      {
        path: "/composer/:id",
        component: JSResource(
          "ComposerView",
          () => import(/* webpackChunkName: 'ComposerView' */ "./components/ComposerView")
        ),
        prepare: (params: { id: any }) => {
          const query = require("__relay__/ComposerViewQuery.graphql");
          return {
            queryRef: loadQuery(relayEnv, query, {
              composerId: params.id,
            }),
          };
        },
        routes: [
          {
            path: "/composer/:id/work/:workId",
            component: JSResource(
              "ComposerViewWork",
              () =>
                import(
                  /* webpackChunkName: 'ComposerViewWork' */ "./components/ComposerViewWork"
                )
            ),
            prepare: (params: { workId: any }) => {
              const query = require("__relay__/ComposerViewWorkQuery.graphql");
              return {
                queryRef: loadQuery(relayEnv, query, {
                  workId: params.workId,
                }),
              };
            },
          },
          {
            path: "/composer/:id/bio",
            component: JSResource(
              "ComposerViewBio",
              () =>
                import(
                  /* webpackChunkName: 'ComposerViewBio' */ "./components/ComposerViewBio"
                )
            ),
            prepare: (params: { id: any }) => {
              const query = require("__relay__/ComposerViewBioQuery.graphql");
              return {
                queryRef: loadQuery(relayEnv, query, {
                  composerId: params.id,
                }),
              };
            },
          },
          {
            path: "/composer/:id",
            component: JSResource(
              "ComposerViewDefault",
              () =>
                import(
                  /* webpackChunkName: 'ComposerViewDefault' */ "./components/ComposerViewDefault"
                )
            ),
            prepare: (params: { id: any }) => {
              const query = require("__relay__/ComposerViewDefaultQuery.graphql");
              return {
                queryRef: loadQuery(relayEnv, query, {
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
