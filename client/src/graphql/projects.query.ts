import gql from "graphql-tag";

import { projectFragment } from "./projects.fragment";

export const projectsQuery = gql`
  query ProjectsQuery {
    projects {
      ...ProjectFragment
    }
  }

  ${projectFragment}
`;

export default projectsQuery;
