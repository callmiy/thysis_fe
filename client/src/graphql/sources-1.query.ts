import gql from "graphql-tag";

import sourceFrag from "./source.fragment";

export const sources1Query = gql`
  query Sources1 {
    sources {
      ...SourceFrag
    }
  }

  ${sourceFrag}
`;

export default sources1Query;
