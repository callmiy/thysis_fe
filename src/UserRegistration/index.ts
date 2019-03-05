import { graphql, compose } from "react-apollo";

import {
  UserRegMutation,
  UserRegMutationVariables
} from "../graphql/apollo-types/UserRegMutation";
import {
  USER_REG_MUTATION,
  UserRegistrationMutationProps
} from "../graphql/user-reg.mutation";
import { userLocalMutationGql } from "./../state/user.local.mutation";
import { UserRegistration } from "./user-registration-x";

const regUserGql = graphql<
  {},
  UserRegMutation,
  UserRegMutationVariables,
  UserRegistrationMutationProps | undefined
>(USER_REG_MUTATION, {
  props: ({ mutate }) => mutate && { regUser: mutate }
});

export default compose(
  userLocalMutationGql,
  regUserGql
)(UserRegistration);
