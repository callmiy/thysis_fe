import { RouteComponentProps } from "react-router-dom";

import { CurrentProjectLocalData } from "../../state/project.local.query";
import { UserLocalGqlData } from "../../state/auth-user.local.query";

export interface State {
  modalOpened: {};
}

export type Props = RouteComponentProps<{}> &
  CurrentProjectLocalData &
  UserLocalGqlData;
