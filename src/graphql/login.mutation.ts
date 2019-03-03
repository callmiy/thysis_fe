import gql from "graphql-tag";

import userFragment from "./user.fragment";
import { projectFragment } from "./project.fragment";

export const loginMutation = gql`
  mutation LoginMutation($login: LoginUser!) {
    login(login: $login) {
      ...UserFragment
      projects {
        ...ProjectFragment
      }
    }
  }
  ${userFragment}
  ${projectFragment}
`;

export default loginMutation;
