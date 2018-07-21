import { withApollo } from "react-apollo";
import { compose } from "react-apollo";
import { withFormik } from "formik";
import { graphql } from "react-apollo";

import { config } from "./formik.config";
import { OwnProps } from "./utils";
import UPDATE_SOURCE_MUTATION from "../../../graphql/update-source.mutation";
import { UpdateSource as UpdateSourceMutation } from "../../../graphql/gen.types";
import { UpdateSourceVariables } from "../../../graphql/gen.types";
import SourceAccordion from "./component";

const updateSourceGraphql = graphql<
  OwnProps,
  UpdateSourceMutation,
  UpdateSourceVariables,
  {} // graphql props such as data, mutate, loading etc.
>(UPDATE_SOURCE_MUTATION, {
  props: ({ mutate, ownProps }) => {
    return {
      updateSource: mutate
    };
  }
});

export default compose(
  withFormik(config),
  withApollo,
  updateSourceGraphql
)(SourceAccordion);
