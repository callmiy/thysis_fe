import { BENUTZER_ENTFERNE_VERANDERUNG } from "../../src/graphql/benutzer-entferne.veranderung";
import {
  BenutzerEntferne,
  BenutzerEntferneVariables
} from "../../src/graphql/apollo-types/BenutzerEntferne";
import {
  USER_LOCAL_MUTATION,
  UserLocalMutationVariable
} from "../../src/state/user.local.mutation";
import { UserRegMutation_registration } from "../../src/graphql/apollo-types/UserRegMutation";
import { Registration } from "../../src/graphql/apollo-types/globalTypes";
import { USER_REG_MUTATION } from "../../src/graphql/user-reg.mutation";
import {
  UserRegMutation,
  UserRegMutationVariables
} from "../../src/graphql/apollo-types/UserRegMutation";
import { USER_TOKEN_ENV_KEY } from "./constants";
import { ALLE_BENUTZER_ENTFERNE_VERANDERUNG } from "../../src/graphql/alle-benutzer-entferne.veranderung";
import { AlleBenutzerEntferneVeranderung } from "../../src/graphql/apollo-types/AlleBenutzerEntferneVeranderung";

export const testUserData: Registration = {
  email: "oluapena1@gmail.com",
  name: "Olu Johnson",
  password: "123456",
  passwordConfirmation: "123456",
  source: "password"
};

export function benutzerEntferne(email: string) {
  cy.mutate<BenutzerEntferne, BenutzerEntferneVariables>({
    mutation: BENUTZER_ENTFERNE_VERANDERUNG,
    variables: { email }
  }).then(result => {
    Cypress.env(USER_TOKEN_ENV_KEY, null);
    const deleted = result && result.data && result.data.benutzerEntferne;

    if (!deleted) {
      throw new Error(`Unable to delete user with email: ${email}`);
    }
  });
}

export function benutzerBehalten(user: UserRegMutation_registration) {
  cy.mutate<UserLocalMutationVariable, UserLocalMutationVariable>({
    mutation: USER_LOCAL_MUTATION,
    variables: {
      user
    }
  });
}

export function benutzerErstellen(
  userData: Registration,
  config: { store?: boolean } = {}
) {
  cy.mutate<UserRegMutation, UserRegMutationVariables>({
    mutation: USER_REG_MUTATION,
    variables: {
      registration: userData
    }
  }).then(resolvedData => {
    const result =
      resolvedData.data &&
      resolvedData.data.registration &&
      resolvedData.data.registration;

    if (!result) {
      throw new Error("Unable to create user");
    }

    Cypress.env(USER_TOKEN_ENV_KEY, result.jwt);

    if (config.store) {
      benutzerBehalten(result);
    }
  });
}

export function alleBenutzerEntferne() {
  cy.mutate<AlleBenutzerEntferneVeranderung, {}>({
    mutation: ALLE_BENUTZER_ENTFERNE_VERANDERUNG
  }).then(resolved => {
    const result =
      resolved && resolved.data && resolved.data.alleBenutzerEntferne;

    if (!result) {
      throw new Error("Unable to delete all users");
    }
  });
}
