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
import { AppRootQuery } from "./__relay__/AppRootQuery.graphql";

const relayEnv = createMockedRelayEnvironment();

const appQuery = graphql`
  query AppRootQuery {
    composers {
      id
      name
    }
  }
`;

const preloadedQuery = loadQuery<AppRootQuery>(relayEnv, appQuery, {});

function App(props: { preloadedQuery: PreloadedQuery<AppRootQuery> }) {
  const data = usePreloadedQuery(appQuery, props.preloadedQuery);
  return (
    <div>
      {data.composers.map((composer) => (
        <div key={composer.id}>{composer.name}</div>
      ))}
    </div>
  );
}

function Root() {
  return (
    <RelayEnvironmentProvider environment={relayEnv}>
      <React.Suspense fallback={"Loading..."}>
        <App preloadedQuery={preloadedQuery} />
      </React.Suspense>
    </RelayEnvironmentProvider>
  );
}

ReactDOM.render(<Root />, document.getElementById("app"));
