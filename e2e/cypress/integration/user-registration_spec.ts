import { USER_REG_URL } from "../../../src/routes/util";
import { Registration } from "../../../src/graphql/apollo-types/globalTypes";

describe("Login user", function() {
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

  it(".should() - register user successfully", function() {
    cy.getByText(/Forgot your password/i).click();
    cy.title().should("include", routeTitle);
    cy.queryByText(/Please check you inbox/i).should("not.exist");
    cy.getByLabelText(/Enter your email address/i).type(email);
    cy.getByText(/Request password reset/i).click();
    cy.getByText(/Please check you inbox/i).should("exist");
  });
});
