import gql from "graphql-tag";

export const sourceTypeFragment = gql`
  fragment SourceTypeFragment on SourceType {
    id
    name
  }
`;

export default sourceTypeFragment;
