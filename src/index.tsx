import * as React from "react";
import * as ReactDOM from "react-dom";
import "semantic-ui-css-offline";
import "react-select/dist/react-select.css";

import App from "./containers/App";
import "./index.scss";
import "./socket";
import { getBackendUrls } from "./get-backend-urls";
import { buildClientCache } from "./apollo-setup";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <App
    {...buildClientCache({
      uri: getBackendUrls(process.env.REACT_APP_API_URL || "").apiUrl
    })}
  />,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
