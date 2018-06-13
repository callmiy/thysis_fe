import { graphql } from "react-apollo";
import { withApollo } from "react-apollo";

import Source from "./route";
import { SourceProps } from "./utils";
import { Source1Query } from "../../graphql/gen.types";
import { Source1QueryVariables } from "../../graphql/gen.types";
import SOURCE_QUERY from "../../graphql/source-1.query";

const sourceGraphQl = graphql<
  SourceProps,
  Source1Query,
  Source1QueryVariables,
  {}
>(SOURCE_QUERY, {
  props: ({ data }) => {
    return { ...data };
  },

  options: ({ match }) => {
    return {
      variables: {
        source: {
          id: match.params.id
        }
      }
    };
  }
});

export default withApollo(sourceGraphQl(Source));
