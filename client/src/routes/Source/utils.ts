import { ApolloError } from "apollo-client";
import { RouteComponentProps } from "react-router-dom";
import { WithApolloClient } from "react-apollo";
import { ChildProps } from "react-apollo";
import { GraphqlQueryControls } from "react-apollo";

import { Quote1FragFragment } from "../../graphql/gen.types";
import { SourceFullQuery } from "../../graphql/gen.types";
import { SourceFullQueryVariables } from "../../graphql/gen.types";

export type OwnProps = RouteComponentProps<{ id: string }> & SourceFullQuery;

export type SourceProps = GraphqlQueryControls<SourceFullQueryVariables> &
  ChildProps<
    WithApolloClient<OwnProps>,
    SourceFullQuery,
    SourceFullQueryVariables
  >;

export interface SourceState {
  loadingQuotes: boolean;
  showingQuotes: boolean;
  quotes?: Quote1FragFragment[];
  fetchQuotesError?: ApolloError;
}
