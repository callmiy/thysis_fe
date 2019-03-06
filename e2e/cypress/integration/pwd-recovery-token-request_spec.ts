import { routeTitle } from "../../../src/PwdRecoveryTokenRequest/pwd-recovery-token-request";
import {
  // benutzerEntferne,
  testUserData,
  benutzerErstellen,
  alleBenutzerEntferne
} from "../support/benutzer";

describe("Password Recovery Token Request", function() {
  const { email } = testUserData;

  beforeEach(() => {
    // cy.checkoutSession();
    benutzerErstellen(testUserData);
    cy.visit("/");
  });

  afterEach(() => {
    // cy.dropSession();
    alleBenutzerEntferne();
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
