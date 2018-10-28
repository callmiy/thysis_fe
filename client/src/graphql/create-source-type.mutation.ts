import gql from "graphql-tag";

import { sourceTypeFrag } from "./source-type.fragment";
import { MutationFn } from "react-apollo";
import { CreateSourceType, CreateSourceTypeVariables } from "./gen.types";

export const createSourceType = gql`
  mutation CreateSourceType($sourceType: CreateSourceTypeInput!) {
    sourceType(sourceType: $sourceType) {
      ...SourceTypeFrag
    }
  }

  ${sourceTypeFrag}
`;

export default createSourceType;

export type CreateSourceTypeFn = MutationFn<
  CreateSourceType,
  CreateSourceTypeVariables
>;
