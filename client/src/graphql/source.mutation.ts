import gql from "graphql-tag";

import { sourceFrag } from "./source.fragment";

export const sourceMut = gql`
  mutation CreateSource($source: CreateSourceInput!) {
    createSource(source: $source) {
      ...SourceFrag
    }
  }
  ${sourceFrag}
`;

export default sourceMut;
