import gql from "graphql-tag";

import sourceTypeFrag from "./source-type.fragment";

export const source1Frag = gql`
  fragment SourceFrag on Source {
    id
    display
    year
    sourceType {
      ...SourceTypeFrag
    }
  }

  ${sourceTypeFrag}
`;

export default source1Frag;
