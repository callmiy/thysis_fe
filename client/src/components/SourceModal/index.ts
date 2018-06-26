import { withRouter } from "react-router-dom";
import { graphql } from "react-apollo";
import { compose } from "react-apollo";

import SourceModal from "./component";
import { CreateSourceMutation } from "../../graphql/gen.types";
import { CreateSourceMutationVariables } from "../../graphql/gen.types";
import CREATE_SOURCE_MUTATION from "../../graphql/source.mutation";
import { OwnProps } from "./utils";

const createSourceGraphql = graphql<
  OwnProps,
  CreateSourceMutation,
  CreateSourceMutationVariables,
  {} // graphql props such as data, mutate, loading etc.
>(CREATE_SOURCE_MUTATION, {
  props: ({ mutate, ownProps }) => {
    return {
      createSource: mutate
    };
  }
});

export default compose(
  withRouter,
  createSourceGraphql
)(SourceModal);
