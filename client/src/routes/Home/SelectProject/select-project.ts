import { DataValue } from "react-apollo";

import { ProjectsQuery } from "../../../graphql/gen.types";
import { ProjectFragment } from "../../../graphql/gen.types";
import { ProjectLocalMutationProps } from "../../../state/project.local.mutation";
import { CreateProjectMutationProps } from "../../../graphql/create-project.mutation";
import { UserLocalGqlData } from "../../../state/auth-user.local.query";

export type OwnProps = CreateProjectMutationProps &
  ProjectLocalMutationProps &
  UserLocalGqlData & {
    onProjectSelected: (project: ProjectFragment) => void;
  };

export type ProjectsGqlDataValue = DataValue<ProjectsQuery>;

export type Props = ProjectsGqlDataValue & OwnProps;

export interface State {
  form: {
    title: string;
  };
}

export const initialState = {
  form: {
    title: ""
  }
};
