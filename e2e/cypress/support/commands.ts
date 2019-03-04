import "cypress-testing-library/add-commands";
import { mockWindowsFetch } from "./mock-windows-fetch";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       *
       */
      checkoutSession: () => Promise<void>;

      /**
       *
       */
      dropSession: () => Promise<void>;
    }
  }
}

const serverUrl = "http://localhost:4017";

Cypress.Commands.add("checkoutSession", async () => {
  const response = await fetch(serverUrl + "/sandbox", {
    cache: "no-store",
    method: "POST"
  });

  const sessionId = await response.text();
  return Cypress.env("sessionId", sessionId);
});

Cypress.Commands.add("dropSession", () =>
  fetch(serverUrl + "/sandbox", {
    method: "DELETE",
    headers: { "x-session-id": Cypress.env("sessionId") }
  })
);

Cypress.on("window:before:load", win => {
  cy.stub(win, "fetch", mockWindowsFetch(fetch));
});
