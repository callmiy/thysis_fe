import gql from "graphql-tag";

import { authorFrag } from "./author.fragment";

export const authorsQuery = gql`
  query GetAllAuthors($author: GetAuthorsInput!) {
    authors(author: $author) {
      ...AuthorFrag
    }
  }

  ${authorFrag}
`;

export default authorsQuery;
