import { ApolloError } from "apollo-client/errors/ApolloError";
import { WithApolloClient } from "react-apollo";
import { GraphqlQueryControls } from "react-apollo";
import { ApolloQueryResult } from "apollo-client";

import { TagsMinimalQuery } from "../../graphql/gen.types";
import { RouteComponentProps } from "react-router-dom";
import { CreateQuoteInput } from "../../graphql/gen.types";
import { TagFragFragment } from "../../graphql/gen.types";
import { VolumeIssueType } from "./form-volume-issue-control.component";
import { PageType } from "./form-page-start-end-control.component";
import { DateType } from "./date.component";
import { SourceFragFragment } from "../../graphql/gen.types";
import { Sources1Query } from "../../graphql/gen.types";
import { Source1Query } from "../../graphql/gen.types";

export interface FormValues {
  tags: TagFragFragment[];
  source: SourceFragFragment | null;
  quote: string;
  date: DateType | null;
  page: PageType | null;
  volumeIssue: VolumeIssueType | null;
  extras: string;
}

export type OwnProps = {
  sourceId?: string;
} & TagsMinimalQuery &
  RouteComponentProps<{ sourceId?: string }>;

export type NewQuoteProps = OwnProps &
  GraphqlQueryControls &
  WithApolloClient<OwnProps>;

export interface NewQuoteState {
  initialFormValues: FormValues;
  formOutputs: CreateQuoteInput;
  sourceId?: string;
  queryResult?: ApolloQueryResult<Sources1Query & Source1Query>;
  graphqlError?: ApolloError;
  submittedSourceId?: string;
  selectedTags: TagFragFragment[]; // from form
}

export enum ShouldReUseSource {
  RE_USE_SOURCE = "re-use source",
  DO_NOT_RE_USE_SOURCE = "do not re-use source"
}
