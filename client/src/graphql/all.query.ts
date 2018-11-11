import gql from "graphql-tag";

import { sourceFullFrag } from "./source-full.fragment";
import { tagFrag } from "./tag-mini.fragment";
import { sourceTypeFrag } from "./source-type.fragment";
import { authorFrag } from "./author.fragment";

export const allQueries = gql`
  query AllQueries($source: GetSourcesInput, $author: GetAuthorsInput) {
    sources(source: $source) {
      ...SourceFullFrag
    }

    tags {
      ...TagFrag
    }

    sourceTypes {
      ...SourceTypeFrag
    }

    authors(author: $author) {
      ...AuthorFrag
    }
  }

  ${authorFrag}
  ${sourceFullFrag}
  ${tagFrag}
  ${sourceTypeFrag}
`;

export default allQueries;
