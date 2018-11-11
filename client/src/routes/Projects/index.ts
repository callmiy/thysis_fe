import { graphql, compose, withApollo } from "react-apollo";
import update from "immutability-helper";

import PROJECTS_QUERY from "../../graphql/projects.query";
import { ProjectsQuery } from "../../graphql/gen.types";
import CREATE_PROJECT_MUTATION, {
  CreateProjectMutationFn,
  CreateProjectMutationProps
} from "../../graphql/create-project.mutation";
import { CreateProjectMutation } from "../../graphql/gen.types";
import { CreateProjectMutationVariables } from "../../graphql/gen.types";
import { SelectProject } from "./route";
import { projectLocalMutationGql } from "../../state/project.local.mutation";
import { ProjectsGqlDataValue, OwnProps } from "./projects";

const projectsGql = graphql<
  {},
  ProjectsQuery,
  {},
  ProjectsGqlDataValue | undefined
>(PROJECTS_QUERY, {
  props: props => props.data
});

const createProjectGql = graphql<
  OwnProps,
  CreateProjectMutation,
  CreateProjectMutationVariables,
  CreateProjectMutationProps
>(CREATE_PROJECT_MUTATION, {
  props: props => {
    const mutate = props.mutate as CreateProjectMutationFn;

    return {
      createProject: (title: string) =>
        mutate({
          variables: {
            project: {
              title,
              userId: props.ownProps.user.userId
            }
          },

          update(client, { data: newProject }) {
            if (!newProject) {
              return;
            }

            const project = newProject.project;

            if (!project) {
              return;
            }

            props.ownProps.updateLocalProject({
              variables: { currentProject: project }
            });

            const data = client.readQuery({
              query: PROJECTS_QUERY
            }) as ProjectsQuery;

            const updatedData = update(data, {
              projects: {
                $push: [project]
              }
            });

            client.writeQuery({
              query: PROJECTS_QUERY,
              data: updatedData
            });
          }
        })
    };
  }
});

export default compose(
  withApollo,
  projectsGql,
  projectLocalMutationGql,
  createProjectGql
)(SelectProject);
