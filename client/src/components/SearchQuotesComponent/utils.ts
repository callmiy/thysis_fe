import { GraphqlQueryControls } from "react-apollo";
import { WithApolloClient } from "react-apollo";
import { ApolloError } from "apollo-client/errors/ApolloError";
import { InputOnChangeData } from "semantic-ui-react/dist/commonjs/elements/Input/Input";

import { AllMatchingTextsVariables } from "../../graphql/gen.types";
import { TextSearchResultFrag } from "../../graphql/gen.types";

export type SemanticOnInputChangeFunc = (
  e: React.ChangeEvent<HTMLInputElement>,
  data: InputOnChangeData
) => void;

export interface SearchQuotesState {
  searchText: "";
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
