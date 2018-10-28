import { ApolloError } from "apollo-client/errors/ApolloError";
import { WithApolloClient, DataValue } from "react-apollo";
import { ApolloQueryResult } from "apollo-client";

import { TagsMinimal as TagsMinimalQuery } from "../../graphql/gen.types";
import { RouteComponentProps } from "react-router-dom";
import { CreateQuoteInput } from "../../graphql/gen.types";
import { TagFrag } from "../../graphql/gen.types";
import { VolumeIssueType } from "./form-volume-issue-control.component";
import { PageType } from "./form-page-start-end-control.component";
import { DateType } from "./date.component";
import { SourceFullFrag } from "../../graphql/gen.types";
import { Sources1Query } from "../../graphql/gen.types";
import { Source1 as Source1Query } from "../../graphql/gen.types";
import { CurrentProjectLocalData } from "../../state/project.local.query";

export interface FormValues {
  tags: TagFrag[];
  source: SourceFullFrag | null;
  quote: string;
  date: DateType | null;
  page: PageType | null;
  volumeIssue: VolumeIssueType | null;
  extras: string;
}

export type OwnProps = WithApolloClient<{}> &
  RouteComponentProps<{ sourceId?: string }> & {
    sourceId?: string;
  };

export type TagsMinimalGqlProps = DataValue<TagsMinimalQuery>;

export type CurrentProjectGqlProps = DataValue<CurrentProjectLocalData>;

export type Props = OwnProps & TagsMinimalGqlProps & CurrentProjectGqlProps;

export interface State {
  initialFormValues: FormValues;
  formOutputs: CreateQuoteInput;
  sourceId?: string;
  queryResult?: ApolloQueryResult<Sources1Query & Source1Query>;
  graphqlError?: ApolloError;
  submittedSourceId?: string | null;
  selectedTags: TagFrag[]; // from form
}

export const initialFormValues: FormValues = {
  tags: [],
  source: null,
  quote: "",
  date: null,
  page: null,
  volumeIssue: null,
  extras: ""
};

export const formOutputs: CreateQuoteInput = {
  date: "",
  sourceId: "",
  tags: [],
  text: ""
};

export enum ShouldReUseSource {
  RE_USE_SOURCE = "re-use source",
  DO_NOT_RE_USE_SOURCE = "do not re-use source"
}
