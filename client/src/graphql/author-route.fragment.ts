import gql from "graphql-tag";

import { sourceForDisplayFrag } from "src/graphql/source-for-display.fragment";

export const authorRouteFrag = gql`
  fragment AuthorRouteFrag on Author {
    id
    lastName
    firstName
    middleName
    __typename
    sources {
      ...SourceForDisplayFrag
    }
  }

  ${sourceForDisplayFrag}
`;

export default authorRouteFrag;
