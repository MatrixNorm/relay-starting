import * as React from "react";
import { usePreloadedQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import { Page404 } from "./Page404";
//types
import { PreloadedQuery } from "react-relay";
import { ComposerDetailedViewQuery } from "__relay__/ComposerDetailedViewQuery.graphql";

// See comment below
type UrlParams = {
  id?: string;
};

export const Query = graphql`
  query ComposerDetailedViewQuery($composerId: ID!) {
    composerById(composerId: $composerId) {
      id
      name
      country
      works {
        id
        name
        kind
        yearOfPublication
      }
    }
  }
`;

export function ComposerDetailedView(props: {
  queryRef: PreloadedQuery<ComposerDetailedViewQuery>;
}) {
  const data = usePreloadedQuery(Query, props.queryRef);
  return (
    <React.Suspense fallback={"Loading..."}>
      <div>{data.composerById?.name}</div>
    </React.Suspense>
  );
}
