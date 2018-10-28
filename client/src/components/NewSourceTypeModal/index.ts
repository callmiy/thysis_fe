import { graphql } from "react-apollo";
import update from "immutability-helper";

import NewSourceTypeModal from "./component";
import { CreateSourceTypeProps, OwnProps } from "./new-source-type-modal";
import CREATE_SOURCE_TYPE_MUTATION from "../../graphql/create-source-type.mutation";
import SOURCE_TYPES_QUERY from "../../graphql/source-types.query";
import {
  CreateSourceType,
  CreateSourceTypeVariables,
  SourceTypes
} from "../../graphql/gen.types";
import { CreateSourceTypeFn } from "../../graphql/create-source-type.mutation";

const createSourceTypeGql = graphql<
  OwnProps,
  CreateSourceType,
  CreateSourceTypeVariables,
  CreateSourceTypeProps | undefined
>(CREATE_SOURCE_TYPE_MUTATION, {
  props: props => {
    const mutate = props.mutate as CreateSourceTypeFn;
    const {
      ownProps: { user }
    } = props;

    if (user) {
      return {
        createSourceType: (name: string) =>
          mutate({
            variables: {
              sourceType: {
                name
              }
            },

            update: (client, { data: newSourceTypeData }) => {
              if (!newSourceTypeData) {
                return;
              }

              const newSourceType = newSourceTypeData.sourceType;

              if (newSourceType) {
                return;
              }

              const data = client.readQuery({
                query: SOURCE_TYPES_QUERY
              }) as SourceTypes;

              const newData = update(data, {
                sourceTypes: {
                  $push: [newSourceType]
                }
              });

              client.writeQuery({
                query: SOURCE_TYPES_QUERY,
                data: newData
              });
            }
          })
      };
    }

    return undefined;
  }
});

export default createSourceTypeGql(NewSourceTypeModal);
