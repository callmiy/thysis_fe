import gql from "graphql-tag";

import sourceMiniFrag from "./source-mini.fragment";

export const sourceMiniQuery = gql`
  query SourceMini {
    sources {
      ...SourceMiniFrag
    }
  }

  ${sourceMiniFrag}
`;

export default sourceMiniQuery;
