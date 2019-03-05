import { USER_REG_URL } from "../../../src/routes/util";
import { Registration } from "../../../src/graphql/apollo-types/globalTypes";
import {
  FORM_RENDER_PROPS,
  uiTexts
} from "../../../src/UserRegistration/user-registration";
import {
  UserRegMutation,
  UserRegMutationVariables
} from "../../../src/graphql/apollo-types/UserRegMutation";
import { USER_REG_MUTATION } from "../../../src/graphql/user-reg.mutation";

describe("Create user", function() {
  const userData: Registration = {
    email: "oluapena1@gmail.com",
    name: "Olu Johnson",
    password: "123456",
    passwordConfirmation: "123456",
    source: "password"
  };

  beforeEach(() => {
    cy.checkoutSession();

    cy.visit(USER_REG_URL);
  });

  afterEach(() => {
    cy.dropSession();
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

  it(".should() - return email not unique error", function() {
    /**
     * Given a user already exists in the system
     */
    cy.mutate<UserRegMutation, UserRegMutationVariables>({
      mutation: USER_REG_MUTATION,
      variables: {
        registration: userData
      }
    });

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
