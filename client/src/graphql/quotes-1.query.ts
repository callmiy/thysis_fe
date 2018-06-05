import gql from "graphql-tag";

import { quote1Frag } from "./quote-1.fragment";

export const quotes1Query = gql`
  query Quotes1($quote: GetQuotes) {
    quotes(quote: $quote) {
      ...Quote1Frag
    }
  }

  ${quote1Frag}
`;

export default quotes1Query;
