import { GraphqlQueryControls } from "react-apollo";
import { WithApolloClient } from "react-apollo";
import { ApolloError } from "apollo-client/errors/ApolloError";

import { AllMatchingTextsVariables } from "../../graphql/gen.types";
import { TextSearchResultFrag } from "../../graphql/gen.types";

export interface State {
  searchText: string;
  searchLoading: boolean;
  result?: TextSearchResultFrag;
  searchError?: ApolloError;
}

export interface OwnProps {
  ignore?: boolean;
}

export type SearchQuotesProps = OwnProps &
  GraphqlQueryControls<AllMatchingTextsVariables> &
  WithApolloClient<OwnProps>;
