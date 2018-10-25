import gql from "graphql-tag";
import userFragment from "./user.fragment";

export const userRegMutation = gql`
  mutation UserRegMutation($registration: Registration!) {
    registration(registration: $registration) {
      ...UserFragment
    }
  }
  ${userFragment}
`;

export default userRegMutation;
