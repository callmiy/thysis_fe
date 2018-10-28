import gql from "graphql-tag";
import { MutationFn } from "react-apollo";

import { sourceFullFrag } from "./source-full.fragment";
import { CreateSourceVariables, CreateSource } from "./gen.types";

export const sourceMut = gql`
  mutation CreateSource($source: CreateSourceInput!) {
    createSource(source: $source) {
      ...SourceFullFrag
    }
  }
  ${sourceFullFrag}
`;

export default sourceMut;

export type CreateSourceFn = MutationFn<CreateSource, CreateSourceVariables>;
