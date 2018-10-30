import { graphql } from "react-apollo";
import update from "immutability-helper";

import NewAuthorModal from "./component";
import {
  CreateAuthorMutationProps,
  OwnProps,
  FormValues
} from "./new-author-modal";
import CREATE_AUTHOR_MUTATION from "../../graphql/create-author.mutation";
import AUTHORS_QUERY from "../../graphql/authors.query";
import {
  CreateAuthor,
  CreateAuthorVariables,
  GetAllAuthors,
  GetAllAuthorsVariables
} from "../../graphql/gen.types";
import { CreateAuthorFn } from "src/graphql/ops.types";

const createAuthorGql = graphql<
  OwnProps,
  CreateAuthor,
  CreateAuthorVariables,
  CreateAuthorMutationProps | undefined
>(CREATE_AUTHOR_MUTATION, {
  props: props => {
    const mutate = props.mutate as CreateAuthorFn;
    const {
      ownProps: { currentProject, user }
    } = props;

    if (currentProject && user) {
      const projectId = currentProject.projectId;
      const userId = user.userId;

      return {
        createAuthor: (variables: FormValues) =>
          mutate({
            variables: {
              author: {
                ...variables,
                projectId,
                userId
              }
            },

            update: async (store, { data: newAuthorData }) => {
              if (!newAuthorData) {
                return;
              }

              const newAuthor = newAuthorData.createAuthor;

              if (!newAuthor) {
                return;
              }

              const query = {
                query: AUTHORS_QUERY,
                variables: {
                  author: {
                    projectId
                  }
                }
              };

              try {
                const data = store.readQuery<
                  GetAllAuthors,
                  GetAllAuthorsVariables
                >(query);

                const newData = update(data, {
                  authors: {
                    $push: [newAuthor]
                  }
                });

                store.writeQuery({ ...query, data: newData });
              } catch (error) {
                const msg = `Can't find field authors({"author":{"projectId":"${projectId}"}})`;

                if (error.message.startsWith(msg)) {
                  return;
                }

                throw error;
              }
            }
          })
      };
    }

    return undefined;
  }
});

export default createAuthorGql(NewAuthorModal);
