import { routeTitle } from "../../../src/PwdRecoveryTokenRequest/pwd-recovery-token-request";

describe("Password Recovery Token Request", function() {
  beforeEach(() => {
    cy.checkoutSession();
    cy.visit("/");
  });

  afterEach(() => {
    cy.dropSession();
  });

  it(".should() - assert that <title> is correct", function() {
    cy.getByText(/Forgot your password/i).click();
    cy.title().should("include", routeTitle);
    cy.getByLabelText(/Enter your email address/i).type("oluapena1@gmail.com");
    cy.getByText(/Request password reset/i).click();
  });
});
