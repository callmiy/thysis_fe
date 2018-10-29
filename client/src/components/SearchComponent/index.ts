import { withApollo, compose, graphql } from "react-apollo";

import SearchQuotes from "./component";
import { OwnProps } from "./search-component";
import { sCSLMutationGql } from "../../state/search-component-state.local.mutation";
import SCSL_QUERY, {
  SCSLQueryProps,
  SCSLData
} from "../../state/search-component-state.local.query";

const scslGql = graphql<OwnProps, SCSLData, {}, SCSLQueryProps | undefined>(
  SCSL_QUERY,
  {
    props: props => props.data
  }
);

export default compose(
  withApollo,
  scslGql,
  sCSLMutationGql
)(SearchQuotes);
