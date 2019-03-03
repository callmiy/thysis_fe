import { withRouter } from "react-router-dom";
import { graphql, compose } from "react-apollo";
import { withFormik } from "formik";
import update from "immutability-helper";

import SourceModal from "./component";
import { CreateSource } from "../../graphql/gen.types";
import { CreateSourceVariables, Sources1Query } from "../../graphql/gen.types";
import CREATE_SOURCE_MUTATION, {
  CreateSourceFn
} from "../../graphql/source.mutation";
import SOURCES_QUERY from "../../graphql/sources-1.query";
import {
  OwnProps,
  CreateSourceProps,
  FormValues,
  formikConfig
} from "./source-modal";
import CURRENT_PROJECT_QUERY, {
  CurrentProjectLocalData,
  CurrProjLocalGqlProps
} from "../../state/project.local.query";

const currentProjGql = graphql<
  {},
  CurrentProjectLocalData,
  {},
  CurrProjLocalGqlProps | void
>(CURRENT_PROJECT_QUERY, {
  props: props => props.data
});

const createSourceGraphql = graphql<
  OwnProps,
  CreateSource,
  CreateSourceVariables,
  CreateSourceProps | undefined
>(CREATE_SOURCE_MUTATION, {
  props: props => {
    const mutate = props.mutate as CreateSourceFn;

    if (!mutate) {
      return;
    }

    const { currentProject } = props.ownProps;

    if (!currentProject) {
      return;
    }

    const { id: projectId } = currentProject;

    return {
      createSource: (values: FormValues) => {
        const variables: CreateSourceVariables = {
          source: {
            sourceTypeId: (values.sourceType && values.sourceType.id) || "0",
            authorIds: values.authors.map(a => a.id),
            topic: values.topic.trim(),
            publication: values.publication.trim() || null,
            url: values.url.trim() || null,
            year: values.year.trim() || null,
            projectId
          }
        };

        return mutate({
          variables,

          update: (store, { data: sourceData }) => {
            if (!sourceData) {
              return;
            }

            const { createSource: source } = sourceData;

            if (!source) {
              return;
            }

            const query = {
              query: SOURCES_QUERY,
              variables: {
                source: { projectId }
              }
            };

            try {
              const data = store.readQuery(query) as Sources1Query;

              const newData = update(data, {
                sources: {
                  $push: [source]
                }
              });

              store.writeQuery({
                ...query,
                data: newData
              });
            } catch (error) {
              const msg = error.message.startsWith(
                `Can't find field sources({"source":{"projectId":"${projectId}"}})`
              );

              if (!msg) {
                throw error;
              }
            }
          }
        });
      }
    };
  }
});

export default compose(
  currentProjGql,
  withRouter,
  createSourceGraphql,
  withFormik(formikConfig)
)(SourceModal);
