import gql from "graphql-tag";

export const quoteFullFrag = gql`
  fragment QuoteFullFrag on Quote {
    id
    text
    date
    extras
    issue
    pageStart
    pageEnd
    volume
    source {
      id
      display
    }
    tags {
      id
      text
    }
  }
`;

export default quoteFullFrag;
