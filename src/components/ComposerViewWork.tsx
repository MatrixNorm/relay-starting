import * as React from "react";
import { usePreloadedQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import Link from "../routing/Link";
//types
import { PreloadedQuery } from "react-relay";
import { ComposerViewWorkQuery } from "__relay__/ComposerViewWorkQuery.graphql";

export const Query = graphql`
  query ComposerViewWorkQuery($workId: ID!) {
    workById(workId: $workId) {
      id
      name
      kind
      yearOfPublication
      description
    }
  }
`;

export function ComposerViewWork(props: {
  prepared: { queryRef: PreloadedQuery<ComposerViewWorkQuery> };
  routeData: any;
}) {
  const data = usePreloadedQuery(Query, props.prepared.queryRef);
  const work = data.workById;
  return (
    <React.Suspense fallback={"Loading..."}>
      {work ? <div>{work.description}</div> : <div>Not found</div>}
    </React.Suspense>
  );
}
