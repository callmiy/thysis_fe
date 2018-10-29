import { GraphqlQueryControls } from "react-apollo";
import { WithApolloClient } from "react-apollo";
import { ApolloError } from "apollo-client/errors/ApolloError";

import { AllMatchingTextsVariables } from "../../graphql/gen.types";
import { TextSearchResultFrag } from "../../graphql/gen.types";
import { SCSLMutateProps } from "../../state/search-component-state.local.mutation";
import { SCSLQueryProps } from "../../state/search-component-state.local.query";

export interface State {
  searchText: string;
  searchLoading: boolean;
  result?: TextSearchResultFrag;
  searchError?: ApolloError;
}

export interface OwnProps extends SCSLMutateProps {
  ignore?: boolean;
}

export type Props = OwnProps &
  GraphqlQueryControls<AllMatchingTextsVariables> &
  WithApolloClient<OwnProps> &
  SCSLQueryProps;
