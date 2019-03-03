import { graphql } from "react-apollo";
import { compose } from "react-apollo";

import AUTH_USER_LOCAL_QUERY, {
  UserLocalGqlData
} from "../../../state/auth-user.local.query";
import CURRENT_PROJECT_QUERY from "../../../state/project.local.query";
import { CurrentProjectLocalData } from "../../../state/project.local.query";
import { LocalUserGqlProps } from "./auth-required";
import { OwnProps } from "./auth-required";
import { CurrentProjectLocalGqlProps } from "./auth-required";
import { AuthRequired } from "./component";

const authUserLocalGraphQl = graphql<
  OwnProps,
  UserLocalGqlData,
  {},
  LocalUserGqlProps
>(AUTH_USER_LOCAL_QUERY, {
  props: ({ data }) => {
    return data;
  }
});

const currentProjectLocalGql = graphql<
  OwnProps,
  CurrentProjectLocalData,
  {},
  CurrentProjectLocalGqlProps
>(CURRENT_PROJECT_QUERY, {
  props: ({ data }) => {
    return data;
  }
});

export default compose(
  authUserLocalGraphQl,
  currentProjectLocalGql
)(AuthRequired);
