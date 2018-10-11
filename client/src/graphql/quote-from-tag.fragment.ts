import gql from "graphql-tag";

export const quoteFromTagFrag = gql`
  fragment QuoteFromtagFrag on Quote {
    id
    text
    date
    source {
      id
      display
    }
  }
`;

export default quoteFromTagFrag;
