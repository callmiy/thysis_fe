import * as React from "react";
import * as ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import "react-select/dist/react-select.css";

import App from "./containers/App";
import "./index.css";
import "./socket";
import { client } from "src/apollo-setup";
import registerServiceWorker from "./registerServiceWorker";

export const appClient = client;

ReactDOM.render(<App client={client} />, document.getElementById(
  "root"
) as HTMLElement);
registerServiceWorker();
