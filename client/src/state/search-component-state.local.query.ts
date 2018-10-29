import gql from "graphql-tag";
import { DataValue } from "react-apollo";

import { State } from "../components/SearchComponent/search-component";
import { textSearchResultFrag } from "../graphql/text-search-result.fragment";

export const queryOps = gql`
  query SearchComponentStateLocalQuery {
    searchComponentState @client {
      searchText
      searchLoading
      result {
        ...TextSearchResultFrag
      }
      searchError
    }
  }

  ${textSearchResultFrag}
`;

export default queryOps;

export interface SCSLData {
  searchComponentState?: State | null;
}

export type SCSLQueryProps = DataValue<SCSLData>;
