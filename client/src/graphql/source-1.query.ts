import gql from "graphql-tag";

import source2Frag from "./source-2.fragment";

export const source1Query = gql`
  query Source1($source: GetSourceInput!) {
    source(source: $source) {
      ...Source2Frag
    }
  }

  ${source2Frag}
`;

export default source1Query;
