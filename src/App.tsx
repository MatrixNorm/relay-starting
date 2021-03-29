import * as React from "react";
import * as ReactDOM from "react-dom";
import graphql from "babel-plugin-relay/macro";
import {
  RelayEnvironmentProvider,
  loadQuery,
  usePreloadedQuery,
} from "react-relay/hooks";
import { createMockedRelayEnvironment } from "./env";

const relayEnv = createMockedRelayEnvironment();

const appQuery = graphql`
  query AppQuery {
    repository(owner: "facebook", name: "relay") {
      name
    }
  }
`;

const preloadedQuery = loadQuery(relayEnv, appQuery, {
  /* query variables */
});

function App(props) {
  const data = usePreloadedQuery(appQuery, props.preloadedQuery);
  return null;
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

ReactDOM.render(<App />, document.getElementById("app"));
