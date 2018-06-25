import { graphql } from "react-apollo";
import { withApollo } from "react-apollo";
import { compose } from "react-apollo";

import Source from "./route";
import { OwnProps } from "./utils";
import { SourceFullQuery } from "../../graphql/gen.types";
import { SourceFullQueryVariables } from "../../graphql/gen.types";
import SOURCE_QUERY from "../../graphql/source-full.query";

const sourceGraphQl = graphql<
  OwnProps,
  SourceFullQuery,
  SourceFullQueryVariables
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

export default compose(
  withApollo,
  sourceGraphQl
)(Source);
