import { graphql, compose } from "react-apollo";
import update from "immutability-helper";

import NewAuthorForm from "./component";
import {
  CreateAuthorMutationProps,
  OwnProps,
  FormValues,
  AuthorUpdateGqlProps
} from "./new-author-modal";
import CREATE_AUTHOR_MUTATION from "../../graphql/create-author.mutation";
import AUTHORS_QUERY from "../../graphql/authors.query";
import {
  CreateAuthor,
  CreateAuthorVariables,
  GetAllAuthors,
  GetAllAuthorsVariables,
  AuthorUpdate,
  AuthorUpdateVariables
} from "../../graphql/gen.types";
import { CreateAuthorFn } from "src/graphql/ops.types";
import USER_LOCAL_QUERY, {
  UserLocalGqlData,
  UserLocalGqlProps
} from "../../state/auth-user.local.query";
import CURRENT_PROJECT_QUERY, {
  CurrentProjectLocalData,
  CurrProjLocalGqlProps
} from "../../state/project.local.query";
import AUTHOR_UPDATE_MUTATION, {
  AuthorUpdateFn
} from "../../graphql/update-author.mutation";

const createAuthorGql = graphql<
  OwnProps & UserLocalGqlData & CurrentProjectLocalData,
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

const userLocalGql = graphql<
  OwnProps,
  UserLocalGqlData,
  {},
  UserLocalGqlProps | undefined
>(USER_LOCAL_QUERY, {
  props: props => props.data
});

const currentProLocalGql = graphql<
  OwnProps,
  CurrentProjectLocalData,
  {},
  CurrProjLocalGqlProps | undefined
>(CURRENT_PROJECT_QUERY, {
  props: props => props.data
});

const authorUpdateGql = graphql<
  OwnProps,
  AuthorUpdate,
  AuthorUpdateVariables,
  AuthorUpdateGqlProps | void
>(AUTHOR_UPDATE_MUTATION, {
  props: props => {
    const mutate = props.mutate as AuthorUpdateFn;

    return {
      authorUpdate: (id: string, form: FormValues) =>
        mutate({
          variables: {
            author: {
              id,
              ...form
            }
          }
        })
    };
  }
});

export default compose(
  currentProLocalGql,
  userLocalGql,
  createAuthorGql,
  authorUpdateGql
)(NewAuthorForm);
