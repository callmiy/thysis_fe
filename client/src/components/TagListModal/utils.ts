import React from "react";

import { RouteComponentProps } from "react-router-dom";

export interface TagListModalProps extends RouteComponentProps<{}> {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
}
