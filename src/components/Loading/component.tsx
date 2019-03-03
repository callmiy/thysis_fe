import * as React from "react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";

import "./loading.scss";

export const Loading = () => (
  <Dimmer inverted={true} className="loading-state" active={true}>
    <Loader size="medium">Loading..</Loader>
  </Dimmer>
);

export default Loading;
