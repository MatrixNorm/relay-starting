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
        component: ComposerDetailedView,
        prepare: (params: { id: any }) => {
          console.log("ComposerDetailedView");
          //console.trace();
          return {
            queryRef: loadQuery(relayEnv, ComposerDetailedViewQuery, {
              composerId: params.id,
            }),
          };
        },
        routes: [
          {
            path: "/composer/:id",
            //exact: true,
            prepare: () => {
              //console.log(2222);
            },
          },
          {
            path: "/composer/:id/work/:workId",
            prepare: () => {
              //console.log(1111);
            },
          },
        ],
      },
    ],
  },
];

export default getRoutes;
