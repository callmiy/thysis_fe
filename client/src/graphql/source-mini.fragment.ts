import gql from "graphql-tag";

import sourceTypeFrag from "./source-type.fragment";

export const sourceMiniFrag = gql`
  fragment SourceMiniFrag on Source {
    id
    display
    sourceType {
      ...SourceTypeFrag
    }
  }

  ${sourceTypeFrag}
`;

export default sourceMiniFrag;
