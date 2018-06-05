import gql from "graphql-tag";

import { source1Frag } from "./source-1.fragment";

export const sourceMut = gql`
  mutation CreateSource($source: CreateSourceInput!) {
    createSource(source: $source) {
      ...SourceFrag
    }
  }
  ${source1Frag}
`;

export default sourceMut;
