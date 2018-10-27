import { graphql } from "react-apollo";
import { withRouter } from "react-router-dom";

import Header from "./component";
import CURRENT_PROJECT_LOCAL_QUERY, {
  CurrentProjectLocalData
} from "../../state/project.local.query";
import { Props } from "./header.utils";

const currentProjectGql = graphql<
  Props,
  CurrentProjectLocalData,
  {},
  CurrentProjectLocalData | void
>(CURRENT_PROJECT_LOCAL_QUERY, {
  props: props => props.data
});

export default withRouter(currentProjectGql(Header));
