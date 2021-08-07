import * as React from "react";
import * as ReactDOM from "react-dom";
import { loadQuery, RelayEnvironmentProvider } from "react-relay/hooks";
import { App, ComposersQuery, SelectorsQuery } from "./App";
import { createMockedRelayEnvironment } from "./env";
//types
import { IEnvironment } from "relay-runtime";
import { AppComposersQuery } from "__relay__/AppComposersQuery.graphql";
import { AppSelectorsQuery } from "__relay__/AppSelectorsQuery.graphql";

export function Root({ env }: { env: IEnvironment }) {
  return (
    <RelayEnvironmentProvider environment={env}>
      <React.Suspense fallback={"Loading..."}>
        <App
          selectorsPreloadedQuery={selectorsPreloadedQuery}
          composersInitialPreloadedQuery={composersInitialPreloadedQuery}
        />
      </React.Suspense>
    </RelayEnvironmentProvider>
  );
}

const relayEnv = createMockedRelayEnvironment({ timeout: 1000 });

const selectorsPreloadedQuery = loadQuery<AppSelectorsQuery>(
  relayEnv,
  SelectorsQuery,
  {}
);
const composersInitialPreloadedQuery = loadQuery<AppComposersQuery>(
  relayEnv,
  ComposersQuery,
  {}
);

ReactDOM.render(<Root env={relayEnv} />, document.getElementById("app"));
