import { graphql, compose, withApollo } from "react-apollo";

import { Login } from "./login-x";
import {
  LoginMutation,
  LoginMutationVariables
} from "../graphql/apollo-types/LoginMutation";
import { LoginMutationMerkmale } from "../graphql/login.mutation";
import { LOGIN_MUTATION } from "../graphql/login.mutation";
import { userLocalMutationGql } from "../state/user.local.mutation";
import USER_LOCAL_QUERY, {
  LoggedOutUserData,
  LoggedOutUserProps
} from "../state/logged-out-user.local.query";
import { OwnProps } from "./login";

const loginMutationGql = graphql<
  OwnProps,
  LoginMutation,
  LoginMutationVariables,
  LoginMutationMerkmale | undefined
>(LOGIN_MUTATION, {
  props: ({ mutate }) =>
    mutate && {
      benutzerEinLogin: mutate
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
