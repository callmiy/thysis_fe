import { graphql, compose, withApollo, DataValue } from "react-apollo";

import REFRESH_USER_QUERY from "src/graphql/refresh-user.query";
import {
  RefreshUserQuery,
  RefreshUserQueryVariables
} from "src/graphql/gen.types";
import { userLocalMutationGql } from "src/state/user.local.mutation";
import { OwnProps } from "./refresh";
import { Refresh } from "./component";
import connectAndLoad from "src/state/initial-data";

const refreshUserGql = graphql<
  OwnProps,
  RefreshUserQuery,
  RefreshUserQueryVariables,
  DataValue<RefreshUserQuery> | undefined
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
