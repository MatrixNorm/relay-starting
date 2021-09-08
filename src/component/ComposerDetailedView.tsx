import * as React from "react";
import { usePreloadedQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import type { PreloadedQuery } from "react-relay";
import type { ComposerDetailedViewQuery } from "__relay__/ComposerDetailedViewQuery.graphql";

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

function Inner__(props: { preloadedQuery: PreloadedQuery<ComposerDetailedViewQuery> }) {
  const data = usePreloadedQuery(Query, props.preloadedQuery);

  if (!data.composerById) {
    return <div>Not found</div>;
  }

  const composer = data.composerById;

  return (
    <div>
      <h3>
        {composer.name} <i>{composer.country}</i>
      </h3>
      {composer.works ? (
        <ul>
          {composer.works.map((work) => (
            <li key={work.id}>
              <span>{work.name}</span>
              <span> {work.kind}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div>This composer is a lazy bummer</div>
      )}
    </div>
  );
}

export function ComposerDetailedView(props: {
  preloadedQuery: PreloadedQuery<ComposerDetailedViewQuery>;
}) {
  return (
    <React.Suspense fallback={"Loading..."}>
      <Inner__ preloadedQuery={props.preloadedQuery} />
    </React.Suspense>
  );
}
