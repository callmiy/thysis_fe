import gql from "graphql-tag";

import { sourceFullFrag } from "./source-full.fragment";

export const sourceQuery = gql`
  query Source1($source: GetSourceInput!) {
    source(source: $source) {
      ...SourceFullFrag
    }
  }

  ${sourceFullFrag}
`;

export default sourceQuery;
