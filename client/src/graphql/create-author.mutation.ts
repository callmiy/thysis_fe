import gql from "graphql-tag";

import authorFrag from "./author.fragment";

export const createAuthor = gql`
  mutation CreateAuthor($author: CreateAuthorInput!) {
    createAuthor(author: $author) {
      ...AuthorFrag
    }
  }

  ${authorFrag}
`;

export default createAuthor;
