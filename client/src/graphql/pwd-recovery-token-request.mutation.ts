import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import {
  PwdRecoveryTokenRequestMutation,
  PwdRecoveryTokenRequestMutationVariables
} from "./apollo-types/PwdRecoveryTokenRequestMutation";

export const PWD_RECOVERY_TOKEN_REQUEST = gql`
  mutation PwdRecoveryTokenRequestMutation($email: String!) {
    anfordernPzs(email: $email) {
      email
      token
    }
  }
`;

export default PWD_RECOVERY_TOKEN_REQUEST;

export type PwdRecoveryTokenRequestFn = MutationFn<
  PwdRecoveryTokenRequestMutation,
  PwdRecoveryTokenRequestMutationVariables
>;

export interface PwdRecoveryTokenRequestProps {
  requestPwdTokenRecovery?: PwdRecoveryTokenRequestFn;
}
