import { RouteComponentProps } from "react-router-dom";

import { PwdRecoveryTokenRequestProps } from "../graphql/pwd-recovery-token-request.mutation";

export interface OwnProps extends RouteComponentProps<{}> {}

export interface Props extends PwdRecoveryTokenRequestProps, OwnProps {}
