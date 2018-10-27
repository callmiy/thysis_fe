import gql from "graphql-tag";
import { projectFragment } from "../graphql/project.fragment";
import { ProjectFragment } from "src/graphql/gen.types";

export const currentProjectLocalQuery = gql`
  query CurrentProjectLocalQuery {
    currentProject @client {
      ...ProjectFragment
    }
  }

  ${projectFragment}
`;

export default currentProjectLocalQuery;

export interface CurrentProjectLocalData {
  currentProject?: ProjectFragment | null;
}
