import gql from "graphql-tag";

export const sourceTypeFrag = gql`
  fragment SourceTypeFrag on SourceType {
    id
    name
    __typename
  }
`;

export default sourceTypeFrag;
