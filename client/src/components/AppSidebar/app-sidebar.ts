import { RouteComponentProps } from "react-router";

import { CurrProjLocalGqlProps } from "src/state/project.local.query";

export interface OwnProps {
  children: JSX.Element;
}

export type Props = RouteComponentProps<{}> & OwnProps & CurrProjLocalGqlProps;
