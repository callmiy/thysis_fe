import gql from "graphql-tag";

export const source2Frag = gql`
  fragment Source2Frag on Source {
    id
    display
  }
`;

export default source2Frag;
