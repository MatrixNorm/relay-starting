import * as React from "react";
import { usePreloadedQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
//types
import { PreloadedQuery } from "react-relay";
import { ComposerDetailedViewQuery } from "__relay__/ComposerDetailedViewQuery.graphql";

type Composer = NonNullable<ComposerDetailedViewQuery["response"]["composerById"]>;

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
  preloadedQuery: PreloadedQuery<ComposerDetailedViewQuery>;
}) {
  const data = usePreloadedQuery(Query, props.preloadedQuery);
  return (
    <React.Suspense fallback={"Loading..."}>
      {data.composerById ? (
        <Details composer={data.composerById} />
      ) : (
        <div>Not found</div>
      )}
    </React.Suspense>
  );
}

function Details({ composer }: { composer: Composer }) {
  return (
    <div>
      <h3>{composer.name}</h3>
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
