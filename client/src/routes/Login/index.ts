import { graphql } from "react-apollo";
import { compose } from "react-apollo";

import { Login } from "./route";
import { LoginMutation } from "src/graphql/gen.types";
import { LoginMutationVariables } from "src/graphql/gen.types";
import { LoginFn } from "src/graphql/ops.types";
import { LoginMutationProps } from "src/graphql/ops.types";
import LOGIN_MUTATION from "src/graphql/login.mutation";
import { userLocalMutationGql } from "src/state/user.local.mutation";
import USER_LOCAL_QUERY, {
  LoggedOutUserData,
  LoggedOutUserProps
} from "src/state/logged-out-user.local.query";
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

const userLocalGql = graphql<
  {},
  LoggedOutUserData,
  {},
  LoggedOutUserProps | undefined
>(USER_LOCAL_QUERY, {
  props: props => props.data
});

export default compose(
  userLocalGql,
  userLocalMutationGql,
  loginMutationGql
)(Login);
