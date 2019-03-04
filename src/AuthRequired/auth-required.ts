import { RouteProps } from "react-router-dom";
import { DataValue } from "react-apollo";

import { CurrentProjectLocalData } from "../state/project.local.query";
import { UserLocalGqlProps } from "../state/auth-user.local.query";

export type LocalUserGqlProps = DataValue<UserLocalGqlProps> | undefined;

export type CurrentProjectLocalGqlProps =
  | DataValue<CurrentProjectLocalData>
  | undefined;

export type OwnProps = RouteProps;

export type Props = OwnProps &
  LocalUserGqlProps &
  CurrentProjectLocalGqlProps & {
    component: React.ComponentClass<{}> | React.StatelessComponent<{}>;
  };
