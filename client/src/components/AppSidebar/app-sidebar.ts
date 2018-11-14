import { RouteComponentProps } from "react-router";

import { UserLocalMutationProps } from "src/state/user.local.mutation";
import { CurrProjLocalGqlProps } from "src/state/project.local.query";

export interface OwnProps {
  children: JSX.Element;
}

export type Props = RouteComponentProps<{}> &
  OwnProps &
  UserLocalMutationProps &
  CurrProjLocalGqlProps;
