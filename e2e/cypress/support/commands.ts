import "cypress-testing-library/add-commands";
import { MutationOptions } from "apollo-client/core/watchQueryOptions";
import { FetchResult } from "react-apollo";

import { mockWindowsFetch } from "./mock-windows-fetch";
import buildClientCache from "../../../src/apollo-setup";
import { getBackendUrls } from "../../../src/get-backend-urls";

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

      /**
       *
       */
      mutate: <TData, TVariables>(
        options: MutationOptions<TData, TVariables>
      ) => Promise<
        // tslint:disable-next-line: no-any
        FetchResult<TData, Record<string, any>, Record<string, any>>
      >;
    }
  }
}

const serverUrl = getBackendUrls(Cypress.env("apiUri"));

Cypress.Commands.add("checkoutSession", async () => {
  const response = await fetch(serverUrl.root + "/sandbox", {
    cache: "no-store",
    method: "POST"
  });

  if (response.ok) {
    const sessionId = await response.text();
    return Cypress.env("sessionId", sessionId);
  }

  return Cypress.env("sessionId", null);
});

Cypress.Commands.add("dropSession", () => {
  const sessionId = Cypress.env("sessionId");

  if (!sessionId) {
    return;
  }

  cy.waitForFetches().then(() =>
    fetch(serverUrl.root + "/sandbox", {
      method: "DELETE",
      headers: { "x-session-id": sessionId }
    })
  );
});

Cypress.Commands.add("waitForFetches", () => {
  if (Cypress.env("fetchCount") === 0) {
    return;
  }

  cy.wait(100).then(() => cy.waitForFetches());
});

Cypress.on("window:before:load", win => {
  cy.stub(win, "fetch", mockWindowsFetch(fetch));
});

Cypress.Commands.add(
  "mutate",
  <TData, TVariables>(options: MutationOptions<TData, TVariables>) => {
    const { client } = buildClientCache({
      uri: serverUrl.apiUrl,
      headers: {
        "x-session-id": Cypress.env("sessionId")
      }
    });
    return client.mutate<TData, TVariables>(options);
  }
);
