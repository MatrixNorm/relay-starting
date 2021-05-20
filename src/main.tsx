import * as React from "react";
import * as ReactDOM from "react-dom";
import { loadQuery } from "react-relay/hooks";
import { Root, InitialQuery } from "./App";
import { createMockedRelayEnvironment } from "./env";

import { AppInitialQuery } from "__relay__/AppInitialQuery.graphql";

const relayEnv = createMockedRelayEnvironment({ timeout: 1000 });

const initialQueryRef = loadQuery<AppInitialQuery>(relayEnv, InitialQuery, {
  country: null,
  workKind: null,
});

ReactDOM.render(
  <Root env={relayEnv} initialQueryRef={initialQueryRef} />,
  document.getElementById("app")
);
