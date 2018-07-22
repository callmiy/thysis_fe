import React from "react";

import { RouteComponentProps } from "react-router-dom";

export interface Props extends RouteComponentProps<{}> {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
}
