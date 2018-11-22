import { RouteComponentProps } from "react-router-dom";
import { DataValue } from "react-apollo";

import { Sources1Query, Sources1QueryVariables } from "../../graphql/gen.types";
import { CurrentProjectLocalData } from "../../state/project.local.query";

export type OwnProps = CurrentProjectLocalData &
  RouteComponentProps<{}> & {
    open: boolean;
    dismissModal: () => void;
    style?: React.CSSProperties;
  };

export type ProjectLocalGqlProps = DataValue<CurrentProjectLocalData>;

export type SourcesGqlProps = DataValue<Sources1Query, Sources1QueryVariables>;

export type Props = OwnProps & ProjectLocalGqlProps & SourcesGqlProps;
