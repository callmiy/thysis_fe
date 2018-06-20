import gql from "graphql-tag";

export const authorFrag = gql`
  fragment AuthorFrag on Author {
    id
    name
  }
`;

export default authorFrag;
