import gql from "graphql-tag";

import { source1Frag } from "./source-1.fragment";
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
  ${source1Frag}
`;

export default quoteMut;
