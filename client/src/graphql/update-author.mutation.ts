import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import { authorFrag } from "./author.fragment";
import { AuthorUpdate, AuthorUpdateVariables } from "./gen.types";

export const authorUpdate = gql`
  mutation AuthorUpdate($author: UpdateAuthorInput!) {
    updateAuthor(author: $author) {
      ...AuthorFrag
    }
  }

  ${authorFrag}
`;

export default authorUpdate;

export type AuthorUpdateFn = MutationFn<AuthorUpdate, AuthorUpdateVariables>;
