import gql from "graphql-tag";

export const textSearchRowFrag = gql`
  fragment TextSearchRowFrag on QuoteFullSearchResultRow {
    id
    text
    source
  }
`;

export default textSearchRowFrag;
