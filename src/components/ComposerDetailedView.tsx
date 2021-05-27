import * as React from "react";
import { usePreloadedQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import Link from "../routing/Link";
//types
import { PreloadedQuery } from "react-relay";
import { ComposerDetailedViewQuery } from "__relay__/ComposerDetailedViewQuery.graphql";
import { prefetch } from "webpack";

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
  prepared: { queryRef: PreloadedQuery<ComposerDetailedViewQuery> };
  routeData: any;
}) {
  const data = usePreloadedQuery(Query, props.prepared.queryRef);
  return (
    <React.Suspense fallback={"Loading..."}>
      {data.composerById ? (
        <Details composer={data.composerById} url={props.routeData.url} />
      ) : (
        <div>Not found</div>
      )}
    </React.Suspense>
  );
}

function Details({ composer, url }: { composer: Composer; url: any }) {
  return (
    <div>
      <h3>{composer.name}</h3>
      {composer.works ? (
        <ul>
          {composer.works.map((work) => (
            <li key={work.id}>
              <Link to={`${url}/work/${work.id}`}>{work.name} </Link>
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
