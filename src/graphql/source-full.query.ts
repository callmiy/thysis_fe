import gql from "graphql-tag";

import sourceFullFrag from "./source-full.fragment";

export const sourceFullQuery = gql`
  query SourceFull($source: GetSourceInput!) {
    source(source: $source) {
      ...SourceFullFrag
    }
  }

  ${sourceFullFrag}
`;

export default sourceFullQuery;
