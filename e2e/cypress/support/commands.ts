import "cypress-testing-library/add-commands";
import { mockWindowsFetch } from "./mock-windows-fetch";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       *
       */
      checkoutSession: () => Chainable<Promise<void>>;

      /**
       *
       */
      dropSession: () => Chainable<Promise<void>>;

      /**
       *
       */
      waitForFetches: () => Chainable<Promise<void>>;
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
  cy.waitForFetches().then(() =>
    fetch(serverUrl + "/sandbox", {
      method: "DELETE",
      headers: { "x-session-id": Cypress.env("sessionId") || "0" }
    })
  )
);

Cypress.Commands.add("waitForFetches", () => {
  if (Cypress.env("fetchCount") === 0) {
    return;
  }

  cy.wait(100).then(() => cy.waitForFetches());
});

Cypress.on("window:before:load", win => {
  cy.stub(win, "fetch", mockWindowsFetch(fetch));
});
