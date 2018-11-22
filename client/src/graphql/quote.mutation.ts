import gql from "graphql-tag";

import { sourceFullFrag } from "./source-full.fragment";
import { quoteFromTagFrag } from "./quote-from-tag.fragment";

export const quoteMut = gql`
  mutation CreateQuote($quote: CreateQuoteInput!) {
    createQuote(quote: $quote) {
      ...QuoteFromTagFrag

      source {
        ...SourceFullFrag
      }
    }
  }

  ${quoteFromTagFrag}
  ${sourceFullFrag}
`;

export default quoteMut;
