import gql from "graphql-tag";
import { MutationFn, MutationOptions } from "react-apollo";

import userFragment from "./user.fragment";
import {
  UserRegMutation,
  UserRegMutationVariables
} from "./apollo-types/UserRegMutation";

export const USER_REG_MUTATION = gql`
  mutation UserRegMutation($registration: Registration!) {
    registration(registration: $registration) {
      ...UserFragment
    }
  }
  ${userFragment}
`;

export default USER_REG_MUTATION;

type UserRegistrationMutationFn = MutationFn<
  UserRegMutation,
  UserRegMutationVariables
>;

export interface UserRegistrationMutationProps {
  regUser?: UserRegistrationMutationFn;
}

export type UserRegistrationMutationArgs = MutationOptions<
  UserRegMutation,
  UserRegMutationVariables
>;
