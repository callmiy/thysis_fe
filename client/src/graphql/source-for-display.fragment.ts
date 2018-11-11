import gql from "graphql-tag";

import { authorFrag } from "src/graphql/author.fragment";
import { sourceTypeFrag } from "src/graphql/source-type.fragment";

export const sourceForDisplayFrag = gql`
  fragment SourceForDisplayFrag on Source {
    id
    year
    topic
    publication
    url
    insertedAt
    updatedAt
    __typename

    authors {
      ...AuthorFrag
    }

    sourceType {
      ...SourceTypeFrag
    }
  }

  ${authorFrag}
  ${sourceTypeFrag}
`;

export default sourceForDisplayFrag;
