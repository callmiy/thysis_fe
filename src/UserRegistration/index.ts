import { graphql, compose } from "react-apollo";

import { UserRegMutation } from "../graphql/gen.types";
import { UserRegMutationVariables } from "../graphql/gen.types";
import { UserRegFn } from "../graphql/ops.types";
import { UserRegMutationProps } from "../graphql/ops.types";
import REG_USER_MUTATION from "../graphql/user-reg.mutation";
import { userLocalMutationGql } from "./../state/user.local.mutation";
import { UserReg } from "./user-registration-x";

const regUserGql = graphql<
  {},
  UserRegMutation,
  UserRegMutationVariables,
  UserRegMutationProps
>(REG_USER_MUTATION, {
  props: props => {
    const mutate = props.mutate as UserRegFn;

    return {
      regUser: mutate
    };
  }
});

export default compose(
  userLocalMutationGql,
  regUserGql
)(UserReg);
