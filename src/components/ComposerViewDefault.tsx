import * as React from "react";
import { usePreloadedQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import Link from "../routing/Link";
//types
import { PreloadedQuery } from "react-relay";
import { ComposerViewDefaultQuery } from "__relay__/ComposerViewDefaultQuery.graphql";

export const Query = graphql`
  query ComposerViewDefaultQuery($composerId: ID!) {
    composerById(composerId: $composerId) {
      works {
        id
        name
        kind
        yearOfPublication
      }
    }
  }
`;

export function ComposerViewDefault(props: {
  queryRef: PreloadedQuery<ComposerViewDefaultQuery>;
  routeData: any;
}) {
  const data = usePreloadedQuery(Query, props.queryRef);
  const works = data.composerById?.works;
  return (
    <>
      {data.composerById ? (
        works ? (
          <ul>
            {works.map((work) => (
              <li key={work.id}>
                <Link to={`${props.routeData.url}/work/${work.id}`}>{work.name} </Link>
                <span> {work.kind}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>This composer is a lazy bummer</div>
        )
      ) : (
        <div>Not found</div>
      )}
    </>
  );
}

export default function (props: {
  prepared: { queryRef: PreloadedQuery<ComposerViewDefaultQuery> };
  routeData: any;
}) {
  return (
    <React.Suspense fallback={"Loading..."}>
      <ComposerViewDefault
        queryRef={props.prepared.queryRef}
        routeData={props.routeData}
      />
    </React.Suspense>
  );
}
