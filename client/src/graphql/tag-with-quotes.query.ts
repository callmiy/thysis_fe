import gql from "graphql-tag";

import { tagQuotesFrag } from "./tag-with-quotes.fragment";

export const tagQuoteQuery = gql`
  query TagQuote($tag: GetTagInput!) {
    tag(tag: $tag) {
      ...TagQuotesFrag
    }
  }
  ${tagQuotesFrag}
`;

export default tagQuoteQuery;
