import gql from "graphql-tag";

import sourceFullFrag from "./source-full.fragment";

export const updateSource = gql`
  mutation UpdateSource($source: UpdateSourceInput!) {
    updateSource(source: $source) {
      ...SourceFullFrag
    }
  }

  ${sourceFullFrag}
`;

export default updateSource;
