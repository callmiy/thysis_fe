import gql from "graphql-tag";

import { sourceFullFrag } from "./source-full.fragment";

export const sources1Query = gql`
  query Sources1Query($source: GetSourcesInput!) {
    sources(source: $source) {
      ...SourceFullFrag
    }
  }

  ${sourceFullFrag}
`;

export default sources1Query;
