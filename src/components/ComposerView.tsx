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
  queryRef: PreloadedQuery<ComposerViewQuery>;
  routeData: any;
  children: any;
}) {
  console.log("before");
  const data = usePreloadedQuery(Query, props.queryRef);
  console.log("after");
  return (
    <>
      {data.composerById ? (
        <div>
          <h3>{data.composerById.name}</h3>
          <nav>
            <Link to={props.routeData.url}>Default</Link>
            <span> </span>
            <Link to={`${props.routeData.url}/bio`}>Bio</Link>
          </nav>
          {props.children}
        </div>
      ) : (
        <div>Not found</div>
      )}
    </>
  );
}

export default function (props: {
  prepared: { queryRef: PreloadedQuery<ComposerViewQuery> };
  routeData: any;
  children: any;
}) {
  return (
    <React.Suspense fallback={"Loading..."}>
      <ComposerView
        queryRef={props.prepared.queryRef}
        routeData={props.routeData}
        children={props.children}
      />
    </React.Suspense>
  );
}
