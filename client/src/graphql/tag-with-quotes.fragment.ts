import gql from "graphql-tag";

import { tagFrag } from "./tag-mini.fragment";
import { quoteFromTagFrag } from "./quote-from-tag.fragment";

export const tagQuotesFrag = gql`
  fragment TagQuotesFrag on Tag {
    ...TagFrag
    quotes {
      ...QuoteFromtagFrag
    }
  }
  ${tagFrag}
  ${quoteFromTagFrag}
`;

export default tagQuotesFrag;
