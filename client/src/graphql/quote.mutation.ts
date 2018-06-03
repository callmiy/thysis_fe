import gql from "graphql-tag";

import { sourceMiniFrag } from "./source-mini.fragment";

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
        ...SourceMiniFrag
      }
    }
  }

  ${sourceMiniFrag}
`;

export default quoteMut;
