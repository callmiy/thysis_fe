import gql from "graphql-tag";
import { MutationFn, MutationOptions } from "react-apollo";

import { userFragment } from "./user.fragment";
import { projectFragment } from "./project.fragment";
import {
  LoginMutation,
  LoginMutationVariables
} from "./apollo-types/LoginMutation";

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($login: LoginUser!) {
    login(login: $login) {
      ...UserFragment
      projects {
        ...ProjectFragment
      }
    }
  }
  ${userFragment}
  ${projectFragment}
`;

export default LOGIN_MUTATION;

export type LoginMutationFn = MutationFn<LoginMutation, LoginMutationVariables>;

export interface LoginMutationMerkmale {
  benutzerEinLogin: LoginMutationFn;
}

export type LoginMutationArgs = MutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
