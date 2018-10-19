import gql from "graphql-tag";

import { sourceFullFrag } from "./source-full.fragment";

export const sourceMut = gql`
  mutation CreateSource($source: CreateSourceInput!) {
    createSource(source: $source) {
      ...SourceFullFrag
    }
  }
  ${sourceFullFrag}
`;

export default sourceMut;
