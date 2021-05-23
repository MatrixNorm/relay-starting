import { loadQuery } from "react-relay/hooks";
// types
import { IEnvironment } from "relay-runtime";

const getRoutes = (relayEnv: IEnvironment) => [
  {
    component: Root,
    prepare: (params) => {
      const RootQuery = require("./__generated__/RootQuery.graphql");
      return {
        rootQuery: loadQuery(
          relayEnv,
          RootQuery,
          {
            owner: "facebook",
            name: "relay",
          },
          // The fetchPolicy allows us to specify whether to render from cached
          // data if possible (store-or-network) or only fetch from network
          // (network-only).
          { fetchPolicy: "store-or-network" }
        ),
      };
    },
    routes: [
      {
        path: "/",
        exact: true,
        component: ComposersSearchView,
        prepare: (params) => {
          const IssuesQuery = require("./__generated__/ComposersSearchView.graphql");
          return {
            issuesQuery: loadQuery(
              relayEnv,
              IssuesQuery,
              {
                owner: "facebook",
                name: "relay",
              },
              // The fetchPolicy allows us to specify whether to render from cached
              // data if possible (store-or-network) or only fetch from network
              // (network-only).
              { fetchPolicy: "store-or-network" }
            ),
          };
        },
      },
      {
        path: "/composer/:id",
        component: ComposerDetailedView,
        prepare: (params) => {
          const IssueDetailQuery = require("./__generated__/ComposerDetailedView.graphql");
          return {
            issueDetailQuery: loadQuery(
              relayEnv,
              IssueDetailQuery,
              {
                id: params.id,
              },
              { fetchPolicy: "store-or-network" }
            ),
          };
        },
      },
    ],
  },
]);

export default getRoutes;
