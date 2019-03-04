import gql from "graphql-tag";
import { graphql, MutationOptions } from "react-apollo";
import { MutationFn } from "react-apollo";

import { UserFragment } from "./../graphql/gen.types";
import { userFragment } from "../graphql/user.fragment";

export const userLocalMutation = gql`
  mutation UserLocalMutation($user: LocalUserInput!) {
    user(user: $user) @client {
      ...UserFragment
    }
  }

  ${userFragment}
`;

export default userLocalMutation;

export interface Variable {
  user: UserFragment | null;
}

type Fn = MutationFn<Variable, Variable>;

export interface UserLocalMutationProps {
  updateLocalUser: Fn;
}

export const userLocalMutationGql = graphql<
  {},
  Variable,
  Variable,
  UserLocalMutationProps
>(userLocalMutation, {
  props: props => {
    const mutate = props.mutate as Fn;

    return {
      updateLocalUser: mutate
    };
  }
});

export type UserLocalMutationArgs = MutationOptions<Variable, Variable>;
