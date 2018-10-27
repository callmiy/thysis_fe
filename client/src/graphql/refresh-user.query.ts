import gql from "graphql-tag";

import { userFragment } from "./user.fragment";

export const refreshUserQuery = gql`
  query RefreshUserQuery($refresh: RefreshInput!) {
    refresh(refresh: $refresh) {
      ...UserFragment
    }
  }

  ${userFragment}
`;

export default refreshUserQuery;
