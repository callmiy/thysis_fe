import gql from "graphql-tag";

export const quoteFromTagFrag = gql`
  fragment QuoteFromtagFrag on Quote {
    id
    text
    date
    source {
      display
    }
  }
`;

export default quoteFromTagFrag;
