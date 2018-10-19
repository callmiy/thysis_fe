import gql from "graphql-tag";

export const authorFrag = gql`
  fragment AuthorFrag on Author {
    id
    firstName
    lastName
    middleName
  }
`;

export default authorFrag;
