/// <reference types="Cypress" />
describe("Password Recovery Token Request", function() {
  beforeEach(() => cy.visit("/"));

  it(".should() - assert that <title> is correct", function() {
    cy.getByText(/Forgot your password/i).click();
    cy.title().should("include", "Request Password Recovery");
  });
});
