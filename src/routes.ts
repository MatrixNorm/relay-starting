import { loadQuery } from "react-relay/hooks";
import JSResource from "./JSResource";
// types
import { IEnvironment } from "relay-runtime";

const getRoutes = (relayEnv: IEnvironment) => [
  {
    path: undefined,
    component: JSResource("./components/Root", () => import("./components/Root")),
    prepare: () => {},
    routes: [
      {
        path: "/",
        exact: true,
        component: JSResource(
          "./components/ComposersSearchView",
          () => import("./components/ComposersSearchView")
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
          "./components/ComposerView",
          () => import("./components/ComposerView")
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
              "./components/ComposerViewWork",
              () => import("./components/ComposerViewWork")
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
              "./components/ComposerViewBio",
              () => import("./components/ComposerViewBio")
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
              "./components/ComposerViewDefault",
              () => import("./components/ComposerViewDefault")
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
