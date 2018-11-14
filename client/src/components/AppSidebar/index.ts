import { withRouter } from "react-router";
import { compose, graphql } from "react-apollo";

import AppSideBar from "./component";
import { userLocalMutationGql } from "src/state/user.local.mutation";
import CURRENT_PROJECT_LOCAL_QUERY, {
  CurrProjLocalGqlProps,
  CurrentProjectLocalData
} from "src/state/project.local.query";
import { OwnProps } from "./app-sidebar";

const currentProjectLocalGql = graphql<
  OwnProps,
  CurrentProjectLocalData,
  {},
  CurrProjLocalGqlProps | undefined
>(CURRENT_PROJECT_LOCAL_QUERY, {
  props: props => props.data
});

export default compose(
  withRouter,
  userLocalMutationGql,
  currentProjectLocalGql
)(AppSideBar);
