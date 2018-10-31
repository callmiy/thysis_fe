import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { CurrentProjectLocalData } from "../../state/project.local.query";

export type Props = RouteComponentProps<{}> &
  CurrentProjectLocalData & {
    title: string;
    style?: React.CSSProperties;
    className?: string;
  };

export interface State {
  showingSidebar: boolean;
}

export const INITIAL_STATE: State = {
  showingSidebar: false
};
