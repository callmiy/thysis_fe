import { LoadableComponent } from "react-loadable";
import { RouteProps } from "react-router-dom";
import { DataValue } from "react-apollo";

import { UserFragment } from "../../../graphql/gen.types";
import { CurrentProjectLocalData } from "../../../state/project.local.query";

export interface LocalGraphQlData {
  user?: UserFragment;
  staleToken?: string | null;
}

export type LocalUserGqlProps = DataValue<LocalGraphQlData> | undefined;

export type CurrentProjectLocalGqlProps =
  | DataValue<CurrentProjectLocalData>
  | undefined;

export type OwnProps = RouteProps;

export type Props = OwnProps &
  LocalUserGqlProps &
  CurrentProjectLocalGqlProps & {
    component:
      | (React.ComponentClass<{}> & LoadableComponent)
      | (React.StatelessComponent<{}> & LoadableComponent);
  };
