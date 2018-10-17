import gql from "graphql-tag";

export const authorRouteFrag = gql`
  fragment AuthorRouteFrag on Author {
    id
    name
    sources {
      id
      display
    }
  }
`;

export default authorRouteFrag;
