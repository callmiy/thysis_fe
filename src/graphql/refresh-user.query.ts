import gql from "graphql-tag";
import { DataValue } from "react-apollo";

import { userFragment } from "./user.fragment";
import { projectFragment } from "./project.fragment";
import {
  RefreshUserQuery,
  RefreshUserQueryVariables
} from "./apollo-types/RefreshUserQuery";

export const REFRESH_USER_QUERY = gql`
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

export default REFRESH_USER_QUERY;

export type RefreshUserQueryMerkmale = DataValue<
  RefreshUserQuery,
  RefreshUserQueryVariables
>;
