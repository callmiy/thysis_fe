import { graphql } from "react-apollo";

import CURRENT_PROJECT_QUERY, {
  CurrentProjectLocalData
} from "../../state/project.local.query";
import AuthorsControl from "./component";
import { OwnProps, CurrentProjGqlProps } from "./authors-control";

const currentProjGql = graphql<
  OwnProps,
  CurrentProjectLocalData,
  {},
  CurrentProjGqlProps | undefined
>(CURRENT_PROJECT_QUERY, {
  props: props => props.data
});

export default currentProjGql(AuthorsControl);
