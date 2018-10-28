import { withRouter } from "react-router-dom";
import { graphql, compose, withApollo } from "react-apollo";
import update from "immutability-helper";

import SourceModal from "./component";
import { CreateSource } from "../../graphql/gen.types";
import { CreateSourceVariables, Sources1Query } from "../../graphql/gen.types";
import CREATE_SOURCE_MUTATION, {
  CreateSourceFn
} from "../../graphql/source.mutation";
import SOURCES_QUERY from "../../graphql/sources-1.query";
import { OwnProps, CreateSourceProps, FormValues } from "./source-modal";

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

    const { projectId } = currentProject;

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
            const writeToStore = () => {
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
            };

            try {
              writeToStore();
            } catch (error) {
              const msg = error.message.startsWith(
                `Can't find field sources({"source":{"projectId":"${projectId}"}})`
              );

              if (!msg) {
                throw error;
              }

              // if we did not fetch sources previously, then we do it now
              props.ownProps.client.query(query);
            }
          }
        });
      }
    };
  }
});

export default compose(
  withRouter,
  withApollo,
  createSourceGraphql
)(SourceModal);
