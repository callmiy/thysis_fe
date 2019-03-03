import { RouteComponentProps } from "react-router-dom";
import { WithApolloClient } from "react-apollo";
import { ApolloError } from "apollo-client";

import { CurrentProjectLocalData } from "../../state/project.local.query";
import {
  SourceFullFrag,
  Quotes1_quotes,
  TagFrag
} from "../../graphql/gen.types";

interface OwnProps extends RouteComponentProps<{}> {
  className?: string;
}

export type Props = OwnProps & CurrentProjectLocalData & WithApolloClient<{}>;

export enum ResourceName {
  QUOTES = "quotes",
  TAGS = "tags",
  SOURCES = "sources"
}

export type Resources = Array<Quotes1_quotes | TagFrag | SourceFullFrag>;

export interface State {
  quotes?: Quotes1_quotes[];
  tags?: TagFrag[];
  sources?: SourceFullFrag[];
  loading?: boolean;
  graphQlError?: ApolloError | { message: string };
}
