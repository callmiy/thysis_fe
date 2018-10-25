import gql from "graphql-tag";
import userFragment from "./user.fragment";

export const loginMutation = gql`
  mutation LoginMutation($login: LoginUser!) {
    login(login: $login) {
      ...UserFragment
    }
  }
  ${userFragment}
`;

export default loginMutation;
