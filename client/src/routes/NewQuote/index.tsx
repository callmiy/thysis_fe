import { graphql } from "react-apollo";
import { withApollo } from "react-apollo";

import NewQuote from "./route";
import { NewQuoteProps } from "./utils";
import TAGS_QUERY from "../../graphql/tags-mini.query";
import { TagsMinimal as TagsMinimalQuery } from "../../graphql/gen.types";

const tagsGraphQl = graphql<NewQuoteProps, TagsMinimalQuery, {}, {}>(
  TAGS_QUERY,
  {
    props: ({ data, ownProps }, graphqlDataProps) => {
      // data === graphqlDataProps
      return { ...data };
    }
  }
);

export default withApollo(tagsGraphQl(NewQuote));
