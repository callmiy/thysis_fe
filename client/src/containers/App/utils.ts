import { LoadableComponent } from "react-loadable";
import { RouteProps } from "react-router-dom";
import { ChildProps } from "react-apollo";

import { LoginMutation_login } from "./../../graphql/gen.types";

export interface UserFromLocalState {
  user?: LoginMutation_login;
}

export type AuthOwnProps = RouteProps & {
  component:
    | (React.ComponentClass<{}> & LoadableComponent)
    | (React.StatelessComponent<{}> & LoadableComponent);
};

export type AuthProps = ChildProps<AuthOwnProps, UserFromLocalState, {}>;
