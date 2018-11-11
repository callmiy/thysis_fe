import gql from "graphql-tag";

import { sourceForDisplayFrag } from "src/graphql/source-for-display.fragment";

export const quoteFullFrag = gql`
  fragment QuoteFullFrag on Quote {
    id
    text
    date
    extras
    issue
    pageStart
    pageEnd
    volume
    source {
      ...SourceForDisplayFrag
    }
    tags {
      id
      text
    }
  }

  ${sourceForDisplayFrag}
`;

export default quoteFullFrag;
