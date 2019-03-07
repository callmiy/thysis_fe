import { Registration } from "../../src/graphql/apollo-types/globalTypes";
import {
  FORM_RENDER_PROPS,
  uiTexts
} from "../../src/UserRegistration/user-registration";
import {
  testUserData as userData,
  benutzerErstellen,
  alleBenutzerEntferne
} from "../support/benutzer";
import { USER_REG_URL } from "../../src/routes/util";

describe("Create user", function() {
  beforeEach(() => {
    // cy.checkoutSession();
    cy.visit(USER_REG_URL);
  });

  afterEach(() => {
    // cy.dropSession();
    alleBenutzerEntferne();
  });

  it(".should() - prompt user to create project after registration", function() {
    Object.entries(FORM_RENDER_PROPS).forEach(([key, { label }]) => {
      if (key === "source") {
        return;
      }

      cy.getByLabelText(new RegExp(label, "i")).type(
        userData[key as keyof Registration]
      );
    });

    cy.getByLabelText(new RegExp(uiTexts.submitBtnLabel, "i")).click();

    cy.getByText(
      /You currently have no project. You may create one now/i
    ).should("exist");
  });

  it(".should() - return email must be unique error", function() {
    /**
     * Given a user already exists in the system
     */
    benutzerErstellen(userData);

    /**
     * When a user completes registration form using email that already exists in the system
     */
    Object.entries(FORM_RENDER_PROPS).forEach(([key, { label }]) => {
      if (key === "source") {
        return;
      }

      cy.getByLabelText(new RegExp(label, "i")).type(
        userData[key as keyof Registration]
      );
    });

    /**
     * And user submits the form
     */
    cy.getByLabelText(new RegExp(uiTexts.submitBtnLabel, "i")).click();

    /**
     * Then user should see error showing that email already exists in the system
     */
    cy.getByText(/has already been taken/i).should("exist");
  });
});
