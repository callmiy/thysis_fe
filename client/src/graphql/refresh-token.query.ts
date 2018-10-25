import gql from "graphql-tag";

import { userFragment } from "./user.fragment";

export const refreshToken = gql`
  query RefreshUserToken($refresh: RefreshInput!) {
    refresh(refresh: $refresh) {
      ...UserFragment
    }
  }

  ${userFragment}
`;

export default refreshToken;
