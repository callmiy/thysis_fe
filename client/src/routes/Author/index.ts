import { graphql } from "react-apollo";
import { withApollo } from "react-apollo";
import { compose } from "react-apollo";

import Author from "./route";
import { OwnProps } from "./utils";
import { AuthorRouteQuery } from "../../graphql/gen.types";
import { AuthorRouteQueryVariables } from "../../graphql/gen.types";
import AUTHORS_QUERY from "../../graphql/author-route.query";

const authorsGraphQl = graphql<
  OwnProps,
  AuthorRouteQuery,
  AuthorRouteQueryVariables
>(AUTHORS_QUERY, {
  props: ({ data }) => {
    return { ...data };
  },

  options: ({ match }) => {
    return {
      variables: {
        author: {
          id: match.params.id
        }
      }
    };
  }
});

export default compose(
  withApollo,
  authorsGraphQl
)(Author);
