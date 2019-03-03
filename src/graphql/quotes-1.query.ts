import gql from "graphql-tag";

import { quoteFromTagFrag } from "./quote-from-tag.fragment";

export const quotes1Query = gql`
  query Quotes1($quote: GetQuotes) {
    quotes(quote: $quote) {
      ...QuoteFromTagFrag
    }
  }

  ${quoteFromTagFrag}
`;

export default quotes1Query;
