import gql from "graphql-tag";

import tagFrag from "./tag-mini.fragment";

export const tagMut = gql`
  mutation CreateTag($tag: CreateTagInput!) {
    createTag(tag: $tag) {
      ...TagFrag
    }
  }

  ${tagFrag}
`;

export default tagMut;
