import { routeTitle } from "../../../src/PwdRecoveryTokenRequest/pwd-recovery-token-request";
import { USER_REG_MUTATION } from "../../../src/graphql/user-reg.mutation";
import {
  UserRegMutation,
  UserRegMutationVariables
} from "../../../src/graphql/apollo-types/UserRegMutation";

describe("Password Recovery Token Request", function() {
  const email = "oluapena1@gmail.com";

  beforeEach(() => {
    cy.checkoutSession();

    cy.mutate<UserRegMutation, UserRegMutationVariables>({
      mutation: USER_REG_MUTATION,
      variables: {
        registration: {
          email,
          name: "Oluapena",
          password: "123456",
          passwordConfirmation: "123456",
          source: "password"
        }
      }
    }).then(result => {
      const resultEmail =
        result.data &&
        result.data.registration &&
        result.data.registration.email;

      if (resultEmail !== email) {
        throw new Error("Unable to create user");
      }
    });

    cy.visit("/");
  });

  afterEach(() => {
    cy.dropSession();
  });

  it(".should() - be a successful request", function() {
    cy.getByText(/Forgot your password/i).click();
    cy.title().should("include", routeTitle);
    cy.queryByText(/Please check you inbox/i).should("not.exist");
    cy.getByLabelText(/Enter your email address/i).type(email);
    cy.getByText(/Request password reset/i).click();
    cy.getByText(/Please check you inbox/i).should("exist");
  });
});
