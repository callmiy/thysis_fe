import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { MutationFn } from "react-apollo";

import { UserFragment } from "./../graphql/gen.types";

export const userLocalMutation = gql`
  mutation UserLocalMutation($user: LocalUserInput!) {
    user(user: $user) @client
  }
`;

export default userLocalMutation;

interface Variable {
  user: UserFragment | null;
}

type Fn = MutationFn<void, Variable>;

export interface UserLocalMutationProps {
  updateLocalUser: Fn;
}

export const userLocalMutationGql = graphql<
  {},
  void,
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
