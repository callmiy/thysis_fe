import gql from "graphql-tag";

import source1Frag from "./source-1.fragment";

export const sources1Query = gql`
  query Sources1 {
    sources {
      ...SourceFrag
    }
  }

  ${source1Frag}
`;

export default sources1Query;
