import { uiTexts } from "../../../src/Login/login";
import {
  testUserData,
  benutzerErstellen,
  alleBenutzerEntferne
} from "../support/benutzer";

describe("Password Recovery Token Request", function() {
  beforeEach(() => {
    cy.visit("/");
  });

  afterEach(() => {
    // cy.dropSession();
  });

  it("should render error that username/password incorrect", function() {
    cy.queryByText(/invalid email\/password/i).should("not.exist");

    cy.getByLabelText(/email/i).type("a@b.com");

    cy.getByLabelText(/password/i).type("123456");

    cy.getByLabelText(new RegExp(uiTexts.submitBtnLabel, "i")).click();

    cy.getByText(/invalid email\/password/i).should("exist");
  });

  it("should benutzer einlogin erfolgreich", function() {
    /**
     * Given a user exists in the system.
     */
    benutzerErstellen(testUserData);

    cy.queryByText(
      /You currently have no project. You may create one now/i
    ).should("not.exist");

    cy.getByLabelText(/email/i).type(testUserData.email);

    cy.getByLabelText(/password/i).type(testUserData.password);

    cy.getByLabelText(new RegExp(uiTexts.submitBtnLabel, "i")).click();

    cy.getByText(
      /You currently have no project. You may create one now/i
    ).should("exist");

    /**
     * Clean up
     */
    alleBenutzerEntferne();
  });
});
