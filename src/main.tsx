import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { ComposersSearchView } from "./views/ComposersSearchView";
import { createMockedRelayEnvironment } from "./env";

import { IEnvironment } from "relay-runtime";

const relayEnv = createMockedRelayEnvironment({ timeout: 1000 });

function App({ env }: { env: IEnvironment }) {
  return (
    <RelayEnvironmentProvider environment={env}>
      <Router>
        <nav>
          <Link to="/">Home</Link>
        </nav>
        <Switch>
          <Route path="/composer/:composerId">
            <ComposerDetailedView />
          </Route>
          <Route path="/">
            <ComposersSearchView />
          </Route>
        </Switch>
      </Router>
    </RelayEnvironmentProvider>
  );
}

ReactDOM.render(<App env={relayEnv} />, document.getElementById("app"));
