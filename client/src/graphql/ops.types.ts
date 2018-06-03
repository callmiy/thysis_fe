// import { ApolloQueryResult } from "apollo-client-preset";
import { Query, MutationFn, MutationResult } from "react-apollo";

import {
  TagsMinimalQuery,
  SourceMiniQuery,
  createQuoteMutation,
  createQuoteMutationVariables
} from "./gen.types";

export class TagsMinimalRunQuery extends Query<TagsMinimalQuery, {}> {}

// tslint:disable-next-line:max-classes-per-file
export class SourceMiniRunQuery extends Query<SourceMiniQuery, {}> {}

export type CreateQueryFn = MutationFn<
  createQuoteMutation,
  createQuoteMutationVariables
>;

export type CreateQueryResult = MutationResult<createQuoteMutation>;
