import { withApollo, compose, graphql } from "react-apollo";

import NewQuote from "./route";
import {
  OwnProps,
  Props,
  TagsMinimalGqlProps,
  CurrentProjectGqlProps
} from "./new-quote";
import TAGS_QUERY from "../../graphql/tags-mini.query";
import { TagsMinimal as TagsMinimalQuery } from "../../graphql/gen.types";
import CURRENT_PROJECT_QUERY, {
  CurrentProjectLocalData
} from "../../state/project.local.query";

const tagsGraphQl = graphql<
  Props,
  TagsMinimalQuery,
  {},
  TagsMinimalGqlProps | undefined
>(TAGS_QUERY, {
  props: props => props.data
});

const currentProjectGql = graphql<
  OwnProps,
  CurrentProjectLocalData,
  {},
  CurrentProjectGqlProps | undefined
>(CURRENT_PROJECT_QUERY, {
  props: props => props.data
});

export default compose(
  withApollo,
  tagsGraphQl,
  currentProjectGql
)(NewQuote);
