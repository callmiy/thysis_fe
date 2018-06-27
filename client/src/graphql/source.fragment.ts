import gql from "graphql-tag";

import sourceTypeFrag from "./source-type.fragment";
import authorFrag from "./author.fragment";

export const sourceFrag = gql`
  fragment SourceFrag on Source {
    id
    display
    year
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

export default sourceFrag;
