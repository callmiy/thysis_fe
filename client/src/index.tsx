import * as React from "react";
import * as ReactDOM from "react-dom";
import 'semantic-ui-css-offline';
import "react-select/dist/react-select.css";

import App from "./containers/App";
import "./index.css";
import "./socket";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
