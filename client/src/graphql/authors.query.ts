import gql from "graphql-tag";

import authorFrag from "./author.fragment";

export const authorsQuery = gql`
  query GetAllAuthors {
    authors {
      ...AuthorFrag
    }
  }

  ${authorFrag}
`;

export default authorsQuery;
