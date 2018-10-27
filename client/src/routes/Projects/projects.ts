import { DataValue } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";

import { ProjectsQuery, ProjectFragment } from "../../graphql/gen.types";
import { ProjectLocalMutationProps } from "../../state/project.local.mutation";
import { CreateProjectMutationProps } from "../../graphql/create-project.mutation";
import { UserLocalGqlData } from "../../state/auth-user.local.query";

export type OwnProps = RouteComponentProps &
  CreateProjectMutationProps &
  ProjectLocalMutationProps &
  UserLocalGqlData;

export type ProjectsGqlDataValue = DataValue<ProjectsQuery>;

export type Props = ProjectsGqlDataValue & OwnProps;

export interface State {
  form: {
    title: string;
  };

  currentProject?: ProjectFragment;
}

export const initialState = {
  form: {
    title: ""
  }
};
