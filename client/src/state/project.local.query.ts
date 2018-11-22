import gql from "graphql-tag";
import { projectFragment } from "../graphql/project.fragment";
import { ProjectFragment } from "../graphql/gen.types";
import { DataValue } from "react-apollo";

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

export type CurrProjLocalGqlProps = DataValue<CurrentProjectLocalData>;
