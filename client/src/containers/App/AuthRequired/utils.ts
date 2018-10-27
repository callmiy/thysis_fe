import { LoadableComponent } from "react-loadable";
import { RouteProps } from "react-router-dom";
import { DataValue } from "react-apollo";

import { UserFragment } from "../../../graphql/gen.types";

export interface LocalGraphQlData {
  user?: UserFragment;
  staleToken?: string | null;
}

export type FromGraphQl = DataValue<LocalGraphQlData> | undefined;

export type OwnProps = RouteProps;

export type Props = OwnProps &
  FromGraphQl & {
    component:
      | (React.ComponentClass<{}> & LoadableComponent)
      | (React.StatelessComponent<{}> & LoadableComponent);
  };
