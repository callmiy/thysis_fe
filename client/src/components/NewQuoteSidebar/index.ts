import { withApollo, compose, graphql } from "react-apollo";
import { withRouter } from "react-router-dom";

import QuotesSidebar from "./component";
import LOCAL_PROJECT_QUERY, {
  CurrProjLocalGqlProps,
  CurrentProjectLocalData
} from "src/state/project.local.query";

const currLocalProjGql = graphql<
  {},
  CurrentProjectLocalData,
  {},
  CurrProjLocalGqlProps | void
>(LOCAL_PROJECT_QUERY, {
  props: props => props.data
});

export default compose(
  currLocalProjGql,
  withRouter,
  withApollo
)(QuotesSidebar);
