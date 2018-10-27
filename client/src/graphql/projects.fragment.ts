import gql from "graphql-tag";

export const projectFragment = gql`
  fragment ProjectFragment on Project {
    _id
    projectId
    title
  }
`;

export default projectFragment;
