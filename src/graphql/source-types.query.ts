import gql from "graphql-tag";

import sourceTypeFrag from "./source-type.fragment";

export const sourceTypesQuery = gql`
  query SourceTypes {
    sourceTypes {
      ...SourceTypeFrag
    }
  }

  ${sourceTypeFrag}
`;

export default sourceTypesQuery;
