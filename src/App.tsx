import * as React from "react";
import * as ReactDOM from "react-dom";
import graphql from "babel-plugin-relay/macro";
import {
  RelayEnvironmentProvider,
  loadQuery,
  usePreloadedQuery,
  PreloadedQuery,
} from "react-relay/hooks";
import { createMockedRelayEnvironment } from "./env";
import ComposerSummary from "./ComposerSummary";
import { AppRootQuery } from "__relay__/AppRootQuery.graphql";

const relayEnv = createMockedRelayEnvironment();

const appQuery = graphql`
  query AppRootQuery {
    composers {
      id
      ...ComposerSummary_composer
    }
  }
`;

const queryRef = loadQuery<AppRootQuery>(relayEnv, appQuery, {});

function App(props: { queryRef: PreloadedQuery<AppRootQuery> }) {
  const data = usePreloadedQuery(appQuery, props.queryRef);
  const { composers } = data;
  return (
    <div>
      {composers
        ? composers.map((composer) => (
            <ComposerSummary composer={composer} key={composer.id} />
          ))
        : "Nothing to show"}
    </div>
  );
}

function Root() {
  return (
    <RelayEnvironmentProvider environment={relayEnv}>
      <React.Suspense fallback={"Loading..."}>
        <App queryRef={queryRef} />
      </React.Suspense>
    </RelayEnvironmentProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById("app"));