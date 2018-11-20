import gql from "graphql-tag";

import { userFragment } from "./user.fragment";
import { projectFragment } from "./project.fragment";

export const refreshUserQuery = gql`
  query RefreshUserQuery($refresh: RefreshInput!) {
    refresh(refresh: $refresh) {
      ...UserFragment
      projects {
        ...ProjectFragment
      }
    }
  }
  ${projectFragment}
  ${userFragment}
`;

export default refreshUserQuery;
