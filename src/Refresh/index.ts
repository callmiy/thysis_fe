import { graphql, compose, withApollo } from "react-apollo";

import { REFRESH_USER_QUERY } from "../graphql/refresh-user.query";
import {
  RefreshUserQuery,
  RefreshUserQueryVariables
} from "../graphql/apollo-types/RefreshUserQuery";
import { userLocalMutationGql } from "../state/user.local.mutation";
import { OwnProps } from "./refresh";
import { Refresh } from "./component";
import connectAndLoad from "../state/initial-data";
import { RefreshUserQueryMerkmale } from "../graphql/refresh-user.query";

const refreshUserGql = graphql<
  OwnProps,
  RefreshUserQuery,
  RefreshUserQueryVariables,
  RefreshUserQueryMerkmale | undefined
>(REFRESH_USER_QUERY, {
  props: ({ data, ownProps }) => {
    if (!data) {
      return data;
    }

    const { refresh } = data;

    if (!refresh) {
      return data;
    }

    const { projects, jwt } = refresh;
    const { client, updateLocalUser } = ownProps;

    connectAndLoad(projects, client, jwt);

    updateLocalUser({
      variables: { user: refresh }
    });

    return { ...data, refresh };
  },

  options: ({ jwt }) => ({
    variables: {
      refresh: { jwt }
    }
  })
});

export default compose(
  withApollo,
  userLocalMutationGql,
  refreshUserGql
)(Refresh);
