import gql from "graphql-tag";

import { sourceFullFrag } from "./source-full.fragment";

export const sources1Query = gql`
  query Sources1 {
    sources {
      ...SourceFullFrag
    }
  }

  ${sourceFullFrag}
`;

export default sources1Query;
