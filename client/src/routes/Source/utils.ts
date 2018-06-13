import { GraphQLError } from "graphql/error/GraphQLError";
import { RouteComponentProps } from "react-router-dom";
import { GraphqlQueryControls } from "react-apollo";
import { WithApolloClient } from "react-apollo";

import { Quote1FragFragment } from "../../graphql/gen.types";
import { Source1Query } from "../../graphql/gen.types";
import { Source1QueryVariables } from "../../graphql/gen.types";

type OwnProps = RouteComponentProps<{ id: string }> & Source1Query;

export type SourceProps = OwnProps &
  GraphqlQueryControls<Source1QueryVariables> &
  WithApolloClient<OwnProps>;

export interface SourceState {
  loadingQuotes: boolean;
  showingQuotes: boolean;
  quotes?: Quote1FragFragment[];
  fetchQuotesError?: GraphQLError[];
}
