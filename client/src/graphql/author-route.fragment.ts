import gql from "graphql-tag";

export const authorRouteFrag = gql`
  fragment AuthorRouteFrag on Author {
    id
    lastName
    firstName
    middleName
    sources {
      id
      display
    }
  }
`;

export default authorRouteFrag;
