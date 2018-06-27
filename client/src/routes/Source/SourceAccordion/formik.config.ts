import { WithFormikConfig } from "formik";

import { SourceFullFragFragment } from "../../../graphql/gen.types";
import { Props } from "./utils";

export const config: WithFormikConfig<Props, SourceFullFragFragment> = {
  handleSubmit: async values => null,

  mapPropsToValues: ({ source }) => source,

  enableReinitialize: true,

  validate: ({ authors, topic }) => {
    // tslint:disable-next-line:no-any
    const errors = {} as any;

    if (!authors || !authors.length) {
      errors.authors = "Select at least one author";
    }

    if (!topic || topic.length < 3) {
      errors.topic = "Enter source topic according to author(s)";
    }

    return errors;
  }
};

export default config;
