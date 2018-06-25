import gql from "graphql-tag";

import { sourceFrag } from "./source.fragment";
import { quote1Frag } from "./quote-1.fragment";

export const quoteMut = gql`
  mutation CreateQuote($quote: CreateQuoteInput!) {
    createQuote(quote: $quote) {
      ...Quote1Frag

      source {
        ...SourceFrag
      }
    }
  }

  ${quote1Frag}
  ${sourceFrag}
`;

export default quoteMut;
