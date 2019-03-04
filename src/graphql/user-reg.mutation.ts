import gql from "graphql-tag";
import userFragment from "./user.fragment";

export const USER_REG_MUTATION = gql`
  mutation UserRegMutation($registration: Registration!) {
    registration(registration: $registration) {
      ...UserFragment
    }
  }
  ${userFragment}
`;

export default USER_REG_MUTATION;
