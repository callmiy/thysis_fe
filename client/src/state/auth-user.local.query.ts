import gql from "graphql-tag";

import { userFragment } from "../graphql/user.fragment";
import { UserFragment } from "src/graphql/gen.types";
import { DataValue } from "react-apollo";

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

export type UserLocalGqlProps = DataValue<UserLocalGqlData>;
