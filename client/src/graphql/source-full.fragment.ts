import gql from "graphql-tag";

import sourceFrag from "./source.fragment";

export const sourceFullFrag = gql`
  fragment SourceFullFrag on Source {
    ...SourceFrag
    topic
    publication
    url
    insertedAt
  }

  ${sourceFrag}
`;

export default sourceFullFrag;
