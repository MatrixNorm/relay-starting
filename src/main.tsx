import * as React from "react";
import * as ReactDOM from "react-dom";
import { Root } from "./App";
import { createMockedRelayEnvironment } from "./env";

const relayEnv = createMockedRelayEnvironment();

ReactDOM.render(<Root env={relayEnv} />, document.getElementById("app"));
