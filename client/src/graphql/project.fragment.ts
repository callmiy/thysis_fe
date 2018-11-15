import gql from "graphql-tag";

export const projectFragment = gql`
  fragment ProjectFragment on Project {
    id
    title
    insertedAt
  }
`;

export default projectFragment;
