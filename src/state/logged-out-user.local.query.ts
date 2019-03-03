import gql from "graphql-tag";

import { userFragment } from "../graphql/user.fragment";
import { UserFragment } from "../graphql/gen.types";
import { DataValue } from "react-apollo";

export const loggedOutUserLocalQuery = gql`
  query LoggedOutUserLocalQuery {
    loggedOutUser @client {
      ...UserFragment
    }
  }

  ${userFragment}
`;

export default loggedOutUserLocalQuery;

export interface LoggedOutUserData {
  loggedOutUser: UserFragment;
}

export type LoggedOutUserProps = DataValue<LoggedOutUserData>;
