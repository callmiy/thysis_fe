import { RouteComponentProps } from "react-router-dom";
import { WithApolloClient } from "react-apollo";
import { ApolloError } from "apollo-client";

import { CurrentProjectLocalData } from "src/state/project.local.query";
import { SourceFullFrag, Quote1Frag, TagFrag } from "src/graphql/gen.types";

interface OwnProps extends RouteComponentProps<{}> {
  className?: string;
}

export type Props = OwnProps & CurrentProjectLocalData & WithApolloClient<{}>;

export enum ResourceName {
  QUOTES = "quotes",
  TAGS = "tags",
  SOURCES = "sources"
}

export type Resources = Array<Quote1Frag | TagFrag | SourceFullFrag>;

export interface State {
  quotes?: Quote1Frag[];
  tags?: TagFrag[];
  sources?: SourceFullFrag[];
  loading?: boolean;
  graphQlError?: ApolloError | { message: string };
}
