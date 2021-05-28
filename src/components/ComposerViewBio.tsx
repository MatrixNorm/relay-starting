import * as React from "react";
import { usePreloadedQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import Link from "../routing/Link";
//types
import { PreloadedQuery } from "react-relay";
import { ComposerViewBioQuery } from "__relay__/ComposerViewBioQuery.graphql";

export const Query = graphql`
  query ComposerViewBioQuery($composerId: ID!) {
    composerById(composerId: $composerId) {
      bio
    }
  }
`;

export function ComposerViewBio(props: {
  prepared: { queryRef: PreloadedQuery<ComposerViewBioQuery> };
  routeData: any;
}) {
  const data = usePreloadedQuery(Query, props.prepared.queryRef);
  const composer = data.composerById;
  return (
    <React.Suspense fallback={"Loading..."}>
      {composer ? <div>{composer.bio}</div> : <div>Not found</div>}
    </React.Suspense>
  );
}
