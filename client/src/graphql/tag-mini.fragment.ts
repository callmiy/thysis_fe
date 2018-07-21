import gql from "graphql-tag";

export const tagFrag = gql`
  fragment TagFrag on Tag {
    id
    text
    question
  }
`;

export default tagFrag;
