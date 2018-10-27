import { withRouter } from "react-router-dom";
import { graphql } from "react-apollo";
import { compose } from "react-apollo";

import SourceModal from "./component";
import { CreateSource as CreateSourceMutation } from "../../graphql/gen.types";
import { CreateSourceVariables } from "../../graphql/gen.types";
import CREATE_SOURCE_MUTATION from "../../graphql/source.mutation";
import { OwnProps } from "./source-modal";

const createSourceGraphql = graphql<
  OwnProps,
  CreateSourceMutation,
  CreateSourceVariables,
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
