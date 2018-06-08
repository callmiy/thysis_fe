import gql from "graphql-tag";

export const textSearchRowFrag = gql`
  fragment TextSearchRowFrag on QuoteFullSearchResultRow {
    tid
    text
    source
  }
`;

export default textSearchRowFrag;
