import gql from "graphql-tag";
import { graphql, MutationOptions } from "react-apollo";
import { MutationFn } from "react-apollo";

import { UserRegMutation_registration } from "../graphql/apollo-types/UserRegMutation";
import { userFragment } from "../graphql/user.fragment";

export const USER_LOCAL_MUTATION = gql`
  mutation UserLocalMutation($user: LocalUserInput!) {
    user(user: $user) @client {
      ...UserFragment
    }
  }

  ${userFragment}
`;

export default USER_LOCAL_MUTATION;

export interface UserLocalMutationVariable {
  user: UserRegMutation_registration | null;
}

type Fn = MutationFn<UserLocalMutationVariable, UserLocalMutationVariable>;

export interface UserLocalMutationProps {
  updateLocalUser: Fn;
}

export const userLocalMutationGql = graphql<
  {},
  UserLocalMutationVariable,
  UserLocalMutationVariable,
  UserLocalMutationProps | undefined
>(USER_LOCAL_MUTATION, {
  props: ({ mutate }) =>
    mutate && {
      updateLocalUser: mutate
    }
});

export type UserLocalMutationArgs = MutationOptions<
  UserLocalMutationVariable,
  UserLocalMutationVariable
>;
