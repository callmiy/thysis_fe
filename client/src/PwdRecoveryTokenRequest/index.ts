import { graphql } from "react-apollo";

import PwdRecoveryTokenRequest from "./pwd-recovery-token-request-x";
import {
  PwdRecoveryTokenRequestMutation,
  PwdRecoveryTokenRequestMutationVariables
} from "../graphql/apollo-types/PwdRecoveryTokenRequestMutation";
import {
  PWD_RECOVERY_TOKEN_REQUEST,
  PwdRecoveryTokenRequestProps
} from "../graphql/pwd-recovery-token-request.mutation";
import { OwnProps } from "./pwd-recovery-token-request";

const pwdRecoveryTokenRequestGql = graphql<
  OwnProps,
  PwdRecoveryTokenRequestMutation,
  PwdRecoveryTokenRequestMutationVariables,
  PwdRecoveryTokenRequestProps | undefined
>(PWD_RECOVERY_TOKEN_REQUEST, {
  props: ({ mutate }) =>
    mutate && {
      requestPwdTokenRecovery: mutate
    }
});

export default pwdRecoveryTokenRequestGql(PwdRecoveryTokenRequest);
