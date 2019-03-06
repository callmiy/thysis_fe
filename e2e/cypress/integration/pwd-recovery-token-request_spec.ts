import { routeTitle } from "../../../src/PwdRecoveryTokenRequest/pwd-recovery-token-request";
import { testUserData, benutzerErstellen } from "../support/benutzer";
import { PWD_RECOVERY_REQUEST_ROUTE } from "../../../src/routes/util";

describe("Password Recovery Token Request", function() {
  const { email } = testUserData;

  beforeEach(() => {
    cy.checkoutSession();
    benutzerErstellen(testUserData);
    cy.visit(PWD_RECOVERY_REQUEST_ROUTE);
  });

  afterEach(() => {
    cy.dropSession();
  });

  it(".should() - be a successful request", function() {
    cy.title().should("include", routeTitle);
    cy.queryByText(/Please check you inbox/i).should("not.exist");
    cy.getByLabelText(/Enter your email address/i).type(email);
    cy.getByText(/Request password reset/i).click();
    cy.getByText(/Please check you inbox/i).should("exist");
  });
});
