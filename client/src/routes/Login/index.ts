import { graphql } from "react-apollo";
import { compose } from "react-apollo";

import { Login } from "./route";
import { LoginMutation } from "./../../graphql/gen.types";
import { LoginMutationVariables } from "./../../graphql/gen.types";
import { LoginFn } from "./../../graphql/ops.types";
import { LoginMutationProps } from "./../../graphql/ops.types";
import LOGIN_MUTATION from "./../../graphql/login.mutation";
import { userLocalMutationGql } from "./../../state/user.local.mutation";
import { OwnProps } from "./utils";

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

export default compose(
  userLocalMutationGql,
  loginMutationGql
)(Login);
