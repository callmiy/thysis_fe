import gql from "graphql-tag";

import textSearchRowFrag from "./text-search-row.fragment";

export const textSearchResultFrag = gql`
  fragment TextSearchResultFrag on QuoteFullSearchResult {
    quotes {
      ...TextSearchRowFrag
    }

    sources {
      ...TextSearchRowFrag
    }

    tags {
      ...TextSearchRowFrag
    }

    sourceTypes {
      ...TextSearchRowFrag
    }
  }

  ${textSearchRowFrag}
`;

export default textSearchResultFrag;
