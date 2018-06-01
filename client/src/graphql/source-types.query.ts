import gql from "graphql-tag";

import sourceTypeFragment from "./source-type.fragment";

export const sourceTypesQuery = gql`
  query SourceTypes {
    sourceTypes {
      ...SourceTypeFragment
    }
  }

  ${sourceTypeFragment}
`;

export default sourceTypesQuery;
