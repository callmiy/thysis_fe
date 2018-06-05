import gql from "graphql-tag";

import { source1Frag } from "./source-1.fragment";

export const quoteFrag = gql`
  fragment QuoteFrag on Quote {
    id
    text
    date
  }
`;

export const quoteMut = gql`
  mutation CreateQuote($quote: CreateQuoteInput!) {
    createQuote(quote: $quote) {
      id
      text
      date

      source {
        ...SourceFrag
      }
    }
  }

  ${source1Frag}
`;

export default quoteMut;
