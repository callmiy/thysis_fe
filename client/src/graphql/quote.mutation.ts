import gql from "graphql-tag";

import { sourceFullFrag } from "./source-full.fragment";
import { quote1Frag } from "./quote-1.fragment";

export const quoteMut = gql`
  mutation CreateQuote($quote: CreateQuoteInput!) {
    createQuote(quote: $quote) {
      ...Quote1Frag

      source {
        ...SourceFullFrag
      }
    }
  }

  ${quote1Frag}
  ${sourceFullFrag}
`;

export default quoteMut;
