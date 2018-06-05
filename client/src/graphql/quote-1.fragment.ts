import gql from "graphql-tag";

export const quote1Frag = gql`
  fragment Quote1Frag on Quote {
    id
    text
    date
  }
`;

export default quote1Frag;
