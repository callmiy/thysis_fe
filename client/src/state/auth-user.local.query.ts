import gql from "graphql-tag";

import { userFragment } from "../graphql/user.fragment";

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
