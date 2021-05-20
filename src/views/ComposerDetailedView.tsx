import * as React from "react";
import { useParams } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";
import { Page404 } from "./Page404";

// See comment below
type UrlParams = {
  composerId?: string;
};

const ComposersQuery = graphql`
  query ComposersDetailedViewQuery($composerId: ID!) {
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

function ComposerDetailedView() {
  const { composerId } = useParams<UrlParams>();
  /**
   * This is decoding operation. Ideally it should be automated in
   * a spirit with Clojure Spec. UrlParams type will be derived.
   */
  if (!composerId) {
    return <Page404 />;
  }
}
