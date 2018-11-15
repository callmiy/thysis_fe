import { withApollo } from "react-apollo";
import { compose } from "react-apollo";
import { withFormik } from "formik";
import { graphql } from "react-apollo";

import { OwnProps, formikConfig } from "./source-accordion";
import UPDATE_SOURCE_MUTATION from "../../../graphql/update-source.mutation";
import { UpdateSource as UpdateSourceMutation } from "../../../graphql/gen.types";
import { UpdateSourceVariables } from "../../../graphql/gen.types";
import SourceAccordion from "./component";

const updateSourceGraphql = graphql<
  OwnProps,
  UpdateSourceMutation,
  UpdateSourceVariables,
  {}
>(UPDATE_SOURCE_MUTATION, {
  props: ({ mutate }) => {
    return {
      updateSource: mutate
    };
  }
});

export default compose(
  withFormik(formikConfig),
  withApollo,
  updateSourceGraphql
)(SourceAccordion);
