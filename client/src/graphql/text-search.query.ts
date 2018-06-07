import gql from "graphql-tag";

import textSearchResultFrag from "./text-search-result.fragment";

export const textSearchQuery = gql`
  query AllMatchingTexts($text: QuoteFullSearchInput!) {
    quoteFullSearch(text: $text) {
      ...TextSearchResultFrag
    }
  }

  ${textSearchResultFrag}
`;

export default textSearchQuery;
