import * as React from "react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";

import { classes } from "../utils";

export const Loading = () => (
  <Dimmer inverted={true} className={`${classes.app}`} active={true}>
    <Loader size="medium">Loading..</Loader>
  </Dimmer>
);

export default Loading;
