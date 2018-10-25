import { LoadableComponent } from "react-loadable";
import { RouteProps } from "react-router-dom";
import { ChildProps } from "react-apollo";
import { graphql } from "react-apollo";

import { RefreshUserToken } from "./../../graphql/gen.types";
import { RefreshUserTokenVariables } from "./../../graphql/gen.types";
import REFRESH_TOKEN_QUERY from "./../../graphql/refresh-token.query";
import { userFromLocalStorage } from "./../../state";
import { userToLocalStorage } from "./../../state";

export type AuthOwnProps = RouteProps & {
  component:
    | (React.ComponentClass<{}> & LoadableComponent)
    | (React.StatelessComponent<{}> & LoadableComponent);
};

export type AuthProps = ChildProps<
  AuthOwnProps,
  RefreshUserToken,
  RefreshUserTokenVariables
>;

export const userFromLocalGraphQl = graphql<
  AuthOwnProps,
  RefreshUserToken,
  RefreshUserTokenVariables,
  {}
  // UserFromLocalState
>(REFRESH_TOKEN_QUERY, {
  props: props => {
    if (props.data && props.data.refresh) {
      userToLocalStorage(props.data.refresh);
    }

    return props;
  },

  options: () => {
    const user = userFromLocalStorage();
    const jwt = user ? user.jwt : "";

    return {
      variables: {
        refresh: { jwt }
      }
    };
  }
});
