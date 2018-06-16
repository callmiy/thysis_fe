import { RouteComponentProps } from "react-router-dom";
import { GraphqlQueryControls } from "react-apollo";
import { Sources1Query } from "../../graphql/gen.types";

export type OwnProps = RouteComponentProps<{}> & {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
};

export type ComponentDataProps = GraphqlQueryControls & Sources1Query;

export type SourceListModalProps = OwnProps & ComponentDataProps;
