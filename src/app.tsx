import * as React from "react";
import * as ReactDOM from "react-dom";

function App() {}

ReactDOM.render(
  <App environment={createRelayEnvironment()} />,
  document.getElementById("app")
);
