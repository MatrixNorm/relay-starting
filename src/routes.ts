import { loadQuery } from "react-relay/hooks";
import Root from "./components/Root";
import {
  ComposersSearchView,
  InitialQuery as ComposersSearchViewInitialQuery,
} from "./components/ComposersSearchView";
import {
  ComposerDetailedView,
  Query as ComposerDetailedViewQuery,
} from "./components/ComposerDetailedView";
// types
import { IEnvironment } from "relay-runtime";

const getRoutes = (relayEnv: IEnvironment) => [
  {
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
        component: ComposerDetailedView,
        prepare: (params: { id: any }) => {
          return {
            queryRef: loadQuery(relayEnv, ComposerDetailedViewQuery, {
              composerId: params.id,
            }),
          };
        },
      },
    ],
  },
];

export default getRoutes;
