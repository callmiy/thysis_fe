import { Query, MutationFn, MutationUpdaterFn } from "react-apollo";

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
  TagQuoteQueryVariables
} from "./gen.types";

export class TagsMinimalRunQuery extends Query<TagsMinimalQuery, {}> {}

// tslint:disable-next-line:max-classes-per-file
export class Sources1RunQuery extends Query<Sources1Query, {}> {}

export type CreateQueryFn = MutationFn<
  CreateQuoteMutation,
  CreateQuoteMutationVariables
>;

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
