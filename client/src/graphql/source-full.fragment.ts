import gql from "graphql-tag";

import sourceTypeFrag from "./source-type.fragment";
import authorFrag from "./author.fragment";

export const sourceFullFrag = gql`
  fragment SourceFullFrag on Source {
    id
    year
    topic
    publication
    url
    insertedAt
    __typename

    authors {
      ...AuthorFrag
    }

    sourceType {
      ...SourceTypeFrag
    }
  }

  ${sourceTypeFrag}
  ${authorFrag}
`;

export default sourceFullFrag;
