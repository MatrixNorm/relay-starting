import * as React from "react";
import * as ReactDOM from "react-dom";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { createMockedRelayEnvironment } from "./env";
import { createRouter } from "./routing/createRouter";
import RouterRenderer from "./routing/RouteRenderer";
import RoutingContext from "./routing/RoutingContext";
import getRoutes from "./routes";

import { IEnvironment } from "relay-runtime";

const relayEnv = createMockedRelayEnvironment({ timeout: 500 });
const router = createRouter(getRoutes(relayEnv));

function App({ env }: { env: IEnvironment }) {
  return (
    <RelayEnvironmentProvider environment={env}>
      <RoutingContext.Provider value={router.context}>
        <RouterRenderer />
      </RoutingContext.Provider>
    </RelayEnvironmentProvider>
  );
}

ReactDOM.render(<App env={relayEnv} />, document.getElementById("app"));
