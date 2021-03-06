import * as React from "react";
import * as ReactDOM from "react-dom";
import graphql from "babel-plugin-relay/macro";
import {
  RelayEnvironmentProvider,
  loadQuery,
  usePreloadedQuery,
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

const preloadedQuery = loadQuery(relayEnv, appQuery, {});

function App(props) {
  const data = usePreloadedQuery<AppRootQuery>(appQuery, props.preloadedQuery);
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
