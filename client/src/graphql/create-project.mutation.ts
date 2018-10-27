import gql from "graphql-tag";
import { MutationFn } from "react-apollo";
import { FetchResult } from "react-apollo";

import { projectFragment } from "./project.fragment";
import { CreateProjectMutation } from "./gen.types";
import { CreateProjectMutationVariables } from "./gen.types";

export const createProjectMutation = gql`
  mutation CreateProjectMutation($project: CreateProjectInput!) {
    project(project: $project) {
      ...ProjectFragment
    }
  }

  ${projectFragment}
`;

export default createProjectMutation;

export type CreateProjectMutationFn = MutationFn<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;

export interface CreateProjectMutationProps {
  createProject: (
    title: string
  ) => Promise<void | FetchResult<CreateProjectMutation>>;
}
