import gql from "graphql-tag";

import { sourceMiniFrag } from "./source-mini.fragment";

export const sourceMut = gql`
  mutation CreateSource($source: CreateSourceInput!) {
    createSource(source: $source) {
      ...SourceMiniFrag
    }
  }
  ${sourceMiniFrag}
`;

export default sourceMut;
