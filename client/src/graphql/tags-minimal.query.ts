import gql from "graphql-tag";

import tagFragment from "./tag.fragment";

export const tagMinimalQuery = gql`
  query TagsMinimal {
    tags {
      ...TagFragment
    }
  }

  ${tagFragment}
`;

export default tagMinimalQuery;
