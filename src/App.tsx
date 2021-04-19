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
// should be unnecessary
import { AppRootQuery } from "./__relay__/AppRootQuery.graphql";

const relayEnv = createMockedRelayEnvironment();

// should be typed with AppRootQuery
// all type info is alrady here
const appQuery = graphql`
  query AppRootQuery {
    composers {
      id
      name
    }
  }
`;

// should infer type from appQuery
const preloadedQuery = loadQuery<AppRootQuery>(relayEnv, appQuery, {});

// should be smth like ExtractType<appQuery>
// instead of PreloadedQuery<AppRootQuery>.
// Remember: no import of type AppRootQuery.
function App(props: { preloadedQuery: PreloadedQuery<AppRootQuery> }) {
  // why first parameter is needed?
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
