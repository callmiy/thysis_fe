import gql from "graphql-tag";

import source1Frag from "./source-1.fragment";

export const source1Query = gql`
  query Source1($source: GetSourceInput!) {
    source(source: $source) {
      ...SourceFrag
    }
  }

  ${source1Frag}
`;

export default source1Query;
