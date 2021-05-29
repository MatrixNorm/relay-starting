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
  queryRef: PreloadedQuery<ComposerViewWorkQuery>;
}) {
  const data = usePreloadedQuery(Query, props.queryRef);
  const work = data.workById;
  return (
    <>
      {work ? (
        <div>
          <h3>{work.name}</h3>
          <div>{work.description}</div>
        </div>
      ) : (
        <div>Not found</div>
      )}
    </>
  );
}

export default function (props: {
  prepared: { queryRef: PreloadedQuery<ComposerViewWorkQuery> };
  routeData: any;
}) {
  return (
    <React.Suspense fallback={"Loading..."}>
      <ComposerViewWork queryRef={props.prepared.queryRef} />
    </React.Suspense>
  );
}
