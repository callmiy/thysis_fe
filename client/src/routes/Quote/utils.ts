import { ApolloError } from "apollo-client";
import { RouteComponentProps } from "react-router-dom";
import { WithApolloClient } from "react-apollo";
import { ChildProps } from "react-apollo";
import { GraphqlQueryControls } from "react-apollo";

import { QuoteFull as QuoteFullQuery } from "../../graphql/gen.types";
import { QuoteFullVariables } from "../../graphql/gen.types";

export type OwnProps = RouteComponentProps<{ id: string }> & QuoteFullQuery;

export type Props = GraphqlQueryControls<QuoteFullVariables> &
  ChildProps<WithApolloClient<OwnProps>, QuoteFullQuery, QuoteFullVariables>;

export interface State {
  fetchQuotesError?: ApolloError;
}
