import { Query } from "react-apollo";
import { MutationFn } from "react-apollo";
import { MutationUpdaterFn } from "react-apollo";
import { QueryResult } from "react-apollo";

import {
  TagsMinimalQuery,
  Sources1Query,
  CreateQuoteMutation,
  CreateQuoteMutationVariables,
  CreateTagMutation,
  CreateTagMutationVariables,
  CreateSourceMutation,
  CreateSourceMutationVariables,
  SourceTypesQuery,
  TagQuoteQuery,
  TagQuoteQueryVariables,
  Quotes1Query,
  Quotes1QueryVariables
} from "./gen.types";

export class TagsMinimalRunQuery extends Query<TagsMinimalQuery, {}> {}
export type TagsMinimalQueryResult = QueryResult<TagsMinimalQuery>;

// tslint:disable-next-line:max-classes-per-file
export class Sources1RunQuery extends Query<Sources1Query, {}> {}

export type CreateQuoteFn = MutationFn<
  CreateQuoteMutation,
  CreateQuoteMutationVariables
>;

export type CreateQuoteUpdateFn = MutationUpdaterFn<CreateQuoteMutation>;

export type CreateTagFn = MutationFn<
  CreateTagMutation,
  CreateTagMutationVariables
>;

export type CreateTagUpdateFn = MutationUpdaterFn<CreateTagMutation>;

export type CreateSourceFn = MutationFn<
  CreateSourceMutation,
  CreateSourceMutationVariables
>;

export type CreateSourceUpdateFn = MutationUpdaterFn<CreateSourceMutation>;

// tslint:disable-next-line:max-classes-per-file
export class SourceTypeRunQuery extends Query<SourceTypesQuery, {}> {}

// tslint:disable-next-line:max-classes-per-file
export class TagQuoteRunQuery extends Query<
  TagQuoteQuery,
  TagQuoteQueryVariables
> {}

// tslint:disable-next-line:max-classes-per-file
export class Quotes1QueryComponent extends Query<
  Quotes1Query,
  Quotes1QueryVariables
> {}
