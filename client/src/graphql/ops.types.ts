// import { ApolloQueryResult } from "apollo-client-preset";
import { Query } from "react-apollo";

import { TagsMinimalQuery, SourceMiniQuery } from "./gen.types";

export class TagsMinimalRunQuery extends Query<TagsMinimalQuery, {}> {}

// tslint:disable-next-line:max-classes-per-file
export class SourceMiniRunQuery extends Query<SourceMiniQuery, {}> {}
