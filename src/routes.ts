import { loadQuery } from "react-relay/hooks";
import JSResource from "./JSResource";
import Root from "./components/Root";
// types
import { IEnvironment } from "relay-runtime";
import { RouteConfig } from "./routing/createRouter";

const getRoutes = (relayEnv: IEnvironment): RouteConfig[] => [
  {
    path: undefined,
    resourceOrComponent: Root,
    routes: [
      {
        path: "/",
        exact: true,
        resourceOrComponent: JSResource(
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
        resourceOrComponent: JSResource(
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
            resourceOrComponent: JSResource(
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
            resourceOrComponent: JSResource(
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
            resourceOrComponent: JSResource(
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
