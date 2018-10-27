import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { MutationFn } from "react-apollo";

import { ProjectFragment } from "../graphql/gen.types";

export const projectLocalMutation = gql`
  mutation ProjectLocalMutation($currentProject: LocalProjectInput!) {
    currentProject(currentProject: $currentProject) @client
  }
`;

export default projectLocalMutation;

interface Variable {
  currentProject: ProjectFragment | null;
}

type Fn = MutationFn<void, Variable>;

export interface ProjectLocalMutationProps {
  updateLocalProject: Fn;
}

export const projectLocalMutationGql = graphql<
  {},
  void,
  Variable,
  ProjectLocalMutationProps
>(projectLocalMutation, {
  props: props => {
    const mutate = props.mutate as Fn;

    return {
      updateLocalProject: mutate
    };
  }
});
