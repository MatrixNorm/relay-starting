import * as React from "react";
import { usePreloadedQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import Link from "../routing/Link";
//types
import { PreloadedQuery } from "react-relay";
import { ComposerViewQuery } from "__relay__/ComposerViewQuery.graphql";

export const Query = graphql`
  query ComposerViewQuery($composerId: ID!) {
    composerById(composerId: $composerId) {
      id
      name
      country
    }
  }
`;

export function ComposerView(props: {
  prepared: { queryRef: PreloadedQuery<ComposerViewQuery> };
  routeData: any;
  children: any;
}) {
  const data = usePreloadedQuery(Query, props.prepared.queryRef);
  return (
    <React.Suspense fallback={"Loading..."}>
      {data.composerById ? (
        <div>
          <h3>{data.composerById.name}</h3>
          <nav>
            <Link to={props.routeData.url}>Default</Link>
            <Link to={`${props.routeData.url}/bio`}>Bio</Link>
          </nav>
          {props.children}
        </div>
      ) : (
        <div>Not found</div>
      )}
    </React.Suspense>
  );
}
