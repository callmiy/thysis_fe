import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { MutationFn } from "react-apollo";

import { State } from "../components/SearchComponent/search-component";

export const mutationOps = gql`
  mutation SearchComponentStateLocalMutation(
    $searchComponentState: SearchLocalInput!
  ) {
    searchComponentState(searchComponentState: $searchComponentState) @client
  }
`;

export default mutationOps;

interface Variable {
  searchComponentState: State;
}

type Fn = MutationFn<void, Variable>;

export interface SCSLMutateProps {
  updateSCSLocal: Fn;
}

export const sCSLMutationGql = graphql<{}, void, Variable, SCSLMutateProps>(
  mutationOps,
  {
    props: props => {
      const mutate = props.mutate as Fn;

      return {
        updateSCSLocal: mutate
      };
    }
  }
);
