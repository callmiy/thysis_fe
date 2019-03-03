import { ApolloError } from "apollo-client";
import { RouteComponentProps } from "react-router-dom";
import { WithApolloClient } from "react-apollo";
import { ChildProps } from "react-apollo";
import { GraphqlQueryControls } from "react-apollo";

import {
  AuthorRouteQuery,
  AuthorRouteQuery_author
} from "../../graphql/gen.types";
import { AuthorRouteQueryVariables } from "../../graphql/gen.types";

export type OwnProps = RouteComponentProps<{ id: string }> & AuthorRouteQuery;

export type Props = GraphqlQueryControls<AuthorRouteQueryVariables> &
  ChildProps<
    WithApolloClient<OwnProps>,
    AuthorRouteQuery,
    AuthorRouteQueryVariables
  >;

export interface State {
  fetchAuthorsError?: ApolloError;
  isEditing: boolean;
  author?: AuthorRouteQuery_author;
}
