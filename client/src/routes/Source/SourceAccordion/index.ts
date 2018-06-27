import { withApollo } from "react-apollo";
import { compose } from "react-apollo";
import { withFormik } from "formik";
import { config } from "./formik.config";

import SourceAccordion from "./component";

export default compose(
  withFormik(config),
  withApollo
)(SourceAccordion);
