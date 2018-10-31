import { RouteComponentProps } from "react-router";

export interface OwnProps {
  children: JSX.Element;
}

export type Props = RouteComponentProps<{}> & OwnProps;
