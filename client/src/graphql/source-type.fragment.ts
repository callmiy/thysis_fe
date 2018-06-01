import gql from "graphql-tag";

export const sourceTypeFrag = gql`
  fragment SourceTypeFrag on SourceType {
    id
    name
  }
`;

export default sourceTypeFrag;
