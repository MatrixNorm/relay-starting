import * as React from "react";
import * as ReactDOM from "react-dom";
import { createMockedRelayEnvironment2 } from "./env";
import { createRootComponent } from "./App";

const relayEnv = createMockedRelayEnvironment2({ timeout: 1000 });
const Root = createRootComponent({ relayEnv });
ReactDOM.render(<Root />, document.getElementById("app"));
