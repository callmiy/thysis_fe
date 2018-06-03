import { Query, MutationFn } from "react-apollo";

import {
  TagsMinimalQuery,
  SourceMiniQuery,
  CreateQuoteMutation,
  CreateQuoteMutationVariables,
  CreateTagMutation,
  CreateTagMutationVariables
} from "./gen.types";

export class TagsMinimalRunQuery extends Query<TagsMinimalQuery, {}> {}

// tslint:disable-next-line:max-classes-per-file
export class SourceMiniRunQuery extends Query<SourceMiniQuery, {}> {}

export type CreateQueryFn = MutationFn<
  CreateQuoteMutation,
  CreateQuoteMutationVariables
>;

export type CreateTagFn = MutationFn<
  CreateTagMutation,
  CreateTagMutationVariables
>;
