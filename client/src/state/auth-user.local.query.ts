import gql from "graphql-tag";

import { userFragment } from "../graphql/user.fragment";
import { UserFragment } from "src/graphql/gen.types";

export const authUserLocalQuery = gql`
  query UserLocalQuery {
    user @client {
      ...UserFragment
    }

    staleToken @client
  }

  ${userFragment}
`;

export default authUserLocalQuery;

export interface UserLocalGqlData {
  user: UserFragment;
}
