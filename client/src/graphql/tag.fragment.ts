import gql from "graphql-tag";

export const tagFragment = gql`
  fragment TagFragment on Tag {
    id
    text
  }
`;

export default tagFragment;
