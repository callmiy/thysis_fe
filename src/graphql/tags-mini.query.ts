import gql from "graphql-tag";

import tagFrag from "./tag-mini.fragment";

export const tagMinimalQuery = gql`
  query TagsMinimal {
    tags {
      ...TagFrag
    }
  }

  ${tagFrag}
`;

export default tagMinimalQuery;
