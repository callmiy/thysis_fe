import gql from "graphql-tag";

import { quoteFullFrag } from "./quote-full.fragment";

export const quoteFullQuery = gql`
  query QuoteFull($quote: GetQuoteInput!) {
    quote(quote: $quote) {
      ...QuoteFullFrag
    }
  }

  ${quoteFullFrag}
`;

export default quoteFullQuery;
