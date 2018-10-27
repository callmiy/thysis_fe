import { graphql } from "react-apollo";
import { compose } from "react-apollo";

import REFRESH_USER_QUERY from "../../../graphql/refresh-user.query";
import { RefreshUserQuery } from "../../../graphql/gen.types";
import { RefreshUserQueryVariables } from "../../../graphql/gen.types";
import { userLocalMutationGql } from "../../../state/user.local.mutation";
import { OwnProps } from "./refresh";
import { Refresh } from "./component";

const refreshUserGql = graphql<
  OwnProps,
  RefreshUserQuery,
  RefreshUserQueryVariables
>(REFRESH_USER_QUERY, {
  props: ({ data }) => data || {},
  options: ({ jwt }) => ({
    variables: {
      refresh: { jwt }
    }
  })
});

export default compose(
  refreshUserGql,
  userLocalMutationGql
)(Refresh);
