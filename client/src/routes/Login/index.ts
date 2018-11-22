import { graphql, compose, withApollo } from "react-apollo";

import { Login } from "./route";
import { LoginMutation } from "../../graphql/gen.types";
import { LoginMutationVariables } from "../../graphql/gen.types";
import { LoginFn } from "../../graphql/ops.types";
import { LoginMutationProps } from "../../graphql/ops.types";
import LOGIN_MUTATION from "../../graphql/login.mutation";
import { userLocalMutationGql } from "../../state/user.local.mutation";
import USER_LOCAL_QUERY, {
  LoggedOutUserData,
  LoggedOutUserProps
} from "../../state/logged-out-user.local.query";
import { OwnProps } from "./login";

const loginMutationGql = graphql<
  OwnProps,
  LoginMutation,
  LoginMutationVariables,
  LoginMutationProps
>(LOGIN_MUTATION, {
  props: props => {
    const mutate = props.mutate as LoginFn;

    return {
      login: mutate
    };
  }
});

const loggedOutUserGql = graphql<
  {},
  LoggedOutUserData,
  {},
  LoggedOutUserProps | undefined
>(USER_LOCAL_QUERY, {
  props: props => props.data
});

export default compose(
  loggedOutUserGql,
  userLocalMutationGql,
  loginMutationGql,
  withApollo
)(Login);
