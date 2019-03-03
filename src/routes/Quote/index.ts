import { graphql } from "react-apollo";
import { withApollo } from "react-apollo";
import { compose } from "react-apollo";

import Quote from "./route";
import { OwnProps } from "./quote";
import { QuoteFull as QuoteFullQuery } from "../../graphql/gen.types";
import { QuoteFullVariables } from "../../graphql/gen.types";
import QUOTE_QUERY from "../../graphql/quote-full.query";

const sourceGraphQl = graphql<OwnProps, QuoteFullQuery, QuoteFullVariables>(
  QUOTE_QUERY,
  {
    props: ({ data }) => {
      return { ...data };
    },

    options: ({ match }) => {
      return {
        variables: {
          quote: {
            id: match.params.id
          }
        }
      };
    }
  }
);

export default compose(
  withApollo,
  sourceGraphQl
)(Quote);
