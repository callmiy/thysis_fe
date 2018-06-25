import gql from "graphql-tag";

import sourceFrag from "./source.fragment";

export const sourceQuery = gql`
  query Source1($source: GetSourceInput!) {
    source(source: $source) {
      ...SourceFrag
    }
  }

  ${sourceFrag}
`;

export default sourceQuery;
