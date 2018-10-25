import gql from "graphql-tag";

export const userFragment = gql`
  fragment UserFragment on User {
    _id
    userId
    name
    email
    schemaType
    jwt
  }
`;

export default userFragment;
