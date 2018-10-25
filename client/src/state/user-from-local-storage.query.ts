import gql from "graphql-tag";

import { userFragment } from "./../graphql/user.fragment";

export const userFromLocal = gql`
  query UserFromLocalQuery {
    user @client {
      ...UserFragment
    }
  }

  ${userFragment}
`;

export default userFromLocal;
