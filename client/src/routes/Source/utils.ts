import { ApolloError } from "apollo-client";
import { RouteComponentProps } from "react-router-dom";
import { WithApolloClient } from "react-apollo";
import { ChildProps } from "react-apollo";
import { GraphqlQueryControls } from "react-apollo";

import { Quotes1_quotes } from "../../graphql/gen.types";
import { SourceFull as SourceFullQuery } from "../../graphql/gen.types";
import { SourceFullVariables } from "../../graphql/gen.types";

export type OwnProps = RouteComponentProps<{ id: string }> & SourceFullQuery;

export type SourceProps = GraphqlQueryControls<SourceFullVariables> &
  ChildProps<WithApolloClient<OwnProps>, SourceFullQuery, SourceFullVariables>;

export interface SourceState {
  loadingQuotes: boolean;
  showingQuotes: boolean;
  quotes?: Quotes1_quotes[];
  fetchQuotesError?: ApolloError;
}
