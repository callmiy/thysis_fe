import gql from "graphql-tag";

export const tagFrag = gql`
  fragment TagFrag on Tag {
    id
    text
  }
`;

export default tagFrag;
