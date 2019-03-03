import gql from "graphql-tag";

import { authorRouteFrag } from "./author-route.fragment";

export const authorRouteQuery = gql`
  query AuthorRouteQuery($author: GetAuthorInput!) {
    author(author: $author) {
      ...AuthorRouteFrag
    }
  }

  ${authorRouteFrag}
`;

export default authorRouteQuery;
