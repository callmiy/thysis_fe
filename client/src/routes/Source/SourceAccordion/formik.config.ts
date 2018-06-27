import { WithFormikConfig } from "formik";

import { SourceFullFragFragment } from "../../../graphql/gen.types";
import { Props } from "./utils";
import { UpdateSourceMutationFn } from "../../../graphql/ops.types";
import UPDATE_SOURCE from "../../../graphql/update-source.mutation";

export const config: WithFormikConfig<Props, SourceFullFragFragment> = {
  handleSubmit: async (values, { props }) => {
    try {
      const result = await props.client.mutate<UpdateSourceMutationFn>({
        variables: {
          source: values
        },

        mutation: UPDATE_SOURCE
      });

      // tslint:disable-next-line:no-console
      console.log(
        `


      logging starts


      result`,
        result,
        `

      logging ends


      `
      );
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(
        `


      logging starts


      error`,
        error,
        `

      logging ends


      `
      );
    }
  },

  mapPropsToValues: ({ source }) => source,

  enableReinitialize: true
};

export default config;
