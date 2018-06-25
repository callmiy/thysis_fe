import { Query } from "react-apollo";
import { MutationFn } from "react-apollo";
import { MutationUpdaterFn } from "react-apollo";
import { QueryResult } from "react-apollo";
import { ApolloQueryResult } from "apollo-client";

import { TagsMinimalQuery } from "./gen.types";
import { Sources1Query } from "./gen.types";
import { CreateQuoteMutation } from "./gen.types";
import { CreateQuoteMutationVariables } from "./gen.types";
import { CreateTagMutation } from "./gen.types";
import { CreateTagMutationVariables } from "./gen.types";
import { CreateSourceMutation } from "./gen.types";
import { SourceTypesQuery } from "./gen.types";
import { TagQuoteQuery } from "./gen.types";
import { TagQuoteQueryVariables } from "./gen.types";
import { Quotes1Query } from "./gen.types";
import { Quotes1QueryVariables } from "./gen.types";
import { GetAllAuthorsQuery } from "./gen.types";
import { CreateAuthorMutation } from "./gen.types";
import { CreateAuthorMutationVariables } from "./gen.types";

export class TagsMinimalQueryComponent extends Query<TagsMinimalQuery, {}> {}
export type TagsMinimalQueryResult = QueryResult<TagsMinimalQuery>;
export type TagsMinimalQueryClientResult = ApolloQueryResult<TagsMinimalQuery>;

// tslint:disable-next-line:max-classes-per-file
export class GetAllAuthorsQueryComponent extends Query<
  GetAllAuthorsQuery,
  {}
> {}

// tslint:disable-next-line:max-classes-per-file
export class Sources1QueryComponent extends Query<Sources1Query, {}> {}
export type Sources1QueryClientResult = ApolloQueryResult<Sources1Query>;

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

export type CreateSourceMutationCallResult = ApolloQueryResult<
  CreateSourceMutation
>;

export type CreateSourceUpdateFn = MutationUpdaterFn<CreateSourceMutation>;

// tslint:disable-next-line:max-classes-per-file
export class SourceTypeQueryComponent extends Query<SourceTypesQuery, {}> {}

// tslint:disable-next-line:max-classes-per-file
export class TagQuoteQueryComponent extends Query<
  TagQuoteQuery,
  TagQuoteQueryVariables
> {}

// tslint:disable-next-line:max-classes-per-file
export class Quotes1QueryComponent extends Query<
  Quotes1Query,
  Quotes1QueryVariables
> {}

export type Quotes1QueryClientResult = ApolloQueryResult<Quotes1Query>;

export type CreateAuthorFn = MutationFn<
  CreateAuthorMutation,
  CreateAuthorMutationVariables
>;

export type CreateAuthorUpdateFn = MutationUpdaterFn<CreateAuthorMutation>;
