import { Query } from "react-apollo";
import { MutationFn } from "react-apollo";
import { MutationUpdaterFn } from "react-apollo";
import { QueryResult } from "react-apollo";
import { ApolloQueryResult } from "apollo-client";

import { TagsMinimal as TagsMinimalQuery } from "./gen.types";
import { Sources1 as Sources1Query } from "./gen.types";
import { CreateQuote as CreateQuoteMutation } from "./gen.types";
import { CreateQuoteVariables } from "./gen.types";
import { CreateTag as CreateTagMutation } from "./gen.types";
import { CreateTagVariables } from "./gen.types";
import { CreateSource as CreateSourceMutation } from "./gen.types";
import { CreateSourceVariables } from "./gen.types";
import { SourceTypes as SourceTypesQuery } from "./gen.types";
import { TagQuote as TagQuoteQuery } from "./gen.types";
import { TagQuoteVariables } from "./gen.types";
import { Quotes1 as Quotes1Query } from "./gen.types";
import { Quotes1Variables } from "./gen.types";
import { GetAllAuthors as GetAllAuthorsQuery } from "./gen.types";
import { CreateAuthor as CreateAuthorMutation } from "./gen.types";
import { CreateAuthorVariables } from "./gen.types";
import { UpdateSource as UpdateSourceMutation } from "./gen.types";
import { UpdateSourceVariables } from "./gen.types";
import { UserRegMutation } from "./gen.types";
import { UserRegMutationVariables } from "./gen.types";
import { LoginMutation } from "./gen.types";
import { LoginMutationVariables } from "./gen.types";

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
  CreateQuoteVariables
>;

export type CreateQuoteUpdateFn = MutationUpdaterFn<CreateQuoteMutation>;

export type CreateTagFn = MutationFn<CreateTagMutation, CreateTagVariables>;

export type CreateTagUpdateFn = MutationUpdaterFn<CreateTagMutation>;

export type CreateSourceMutationCallResult = ApolloQueryResult<
  CreateSourceMutation
>;

export type CreateSourceMutationFn = MutationFn<
  CreateSourceMutation,
  CreateSourceVariables
>;

export type CreateSourceUpdateFn = MutationUpdaterFn<CreateSourceMutation>;

export type UpdateSourceMutationFn = MutationFn<
  UpdateSourceMutation,
  UpdateSourceVariables
>;

// tslint:disable-next-line:max-classes-per-file
export class SourceTypeQueryComponent extends Query<SourceTypesQuery, {}> {}

// tslint:disable-next-line:max-classes-per-file
export class TagQuoteQueryComponent extends Query<
  TagQuoteQuery,
  TagQuoteVariables
> {}

// tslint:disable-next-line:max-classes-per-file
export class Quotes1QueryComponent extends Query<
  Quotes1Query,
  Quotes1Variables
> {}

export type Quotes1QueryClientResult = ApolloQueryResult<Quotes1Query>;

export type CreateAuthorFn = MutationFn<
  CreateAuthorMutation,
  CreateAuthorVariables
>;

export type CreateAuthorUpdateFn = MutationUpdaterFn<CreateAuthorMutation>;

export type UserRegFn = MutationFn<UserRegMutation, UserRegMutationVariables>;

export type LoginFn = MutationFn<LoginMutation, LoginMutationVariables>;
