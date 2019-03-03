import { graphql } from "react-apollo";

import CURRENT_PROJECT_QUERY, {
  CurrentProjectLocalData,
  CurrProjLocalGqlProps
} from "../../state/project.local.query";
import AuthorsControl from "./component";
import { OwnProps } from "./authors-control";

const currentProjGql = graphql<
  OwnProps,
  CurrentProjectLocalData,
  {},
  CurrProjLocalGqlProps | undefined
>(CURRENT_PROJECT_QUERY, {
  props: props => props.data
});

export default currentProjGql(AuthorsControl);
