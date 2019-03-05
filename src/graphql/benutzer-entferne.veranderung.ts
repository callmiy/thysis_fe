import gql from "graphql-tag";
import { MutationFn, MutationOptions } from "react-apollo";
// import ApolloClient from "apollo-client";

import {
  BenutzerEntferne,
  BenutzerEntferneVariables
} from "./apollo-types/BenutzerEntferne";

export const BENUTZER_ENTFERNE_VERANDERUNG = gql`
  mutation BenutzerEntferne($email: String!) {
    benutzerEntferne(email: $email)
  }
`;

export default BENUTZER_ENTFERNE_VERANDERUNG;

export type BenutzerEntferneFn = MutationFn<
  BenutzerEntferne,
  BenutzerEntferneVariables
>;

export interface BenutzerEntferneMerkMale {
  benutzerEntferne: BenutzerEntferneFn;
}

export type BenutzerEntferneArgs = MutationOptions<
  BenutzerEntferne,
  BenutzerEntferneVariables
>;

// export function benutzerEntferne(client: ApolloClient<{}>, email: string) {
//   return client.mutate<BenutzerEntferne, BenutzerEntferneVariables>({
//     mutation: BENUTZER_ENTFERNE_VERANDERUNG,
//     variables: { email }
//   });
// }
