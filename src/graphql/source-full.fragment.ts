import gql from "graphql-tag";

import { sourceForDisplayFrag } from "../graphql/source-for-display.fragment";

export const sourceFullFrag = gql`
  fragment SourceFullFrag on Source {
    ...SourceForDisplayFrag
  }

  ${sourceForDisplayFrag}
`;

export default sourceFullFrag;
