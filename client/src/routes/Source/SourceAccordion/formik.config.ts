import { WithFormikConfig } from "formik";
import { FormikErrors } from "formik";

import { AuthorFrag } from "../../../graphql/gen.types";
import { authorFullName } from "../../../graphql/utils";
import { AuthorWithFullName } from "../../../graphql/utils";
import { Props } from "./source-accordion";
import { FormOutput } from "./source-accordion";

export const config: WithFormikConfig<Props, FormOutput> = {
  handleSubmit: async values => null,

  mapPropsToValues: ({ source }) => {
    let authors = [] as AuthorWithFullName[];

    if (source.authors) {
      authors = source.authors.map((a: AuthorFrag) => ({
        ...a,
        fullName: authorFullName(a)
      })) as AuthorWithFullName[];
    }

    return { ...source, authors };
  },

  enableReinitialize: true,

  validate: ({ authors, topic }) => {
    const errors: FormikErrors<FormOutput> = {};

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
