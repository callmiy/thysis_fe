import "cypress-testing-library/add-commands";
import { MutationOptions } from "apollo-client/core/watchQueryOptions";
import { FetchResult } from "react-apollo";

import { mockWindowsFetch } from "./mock-windows-fetch";
import buildClientCache from "../../src/apollo-setup";
import { getBackendUrls } from "../../src/get-backend-urls";
import {
  USER_SESSION_ENV_KEY,
  USER_SERVER_SESSION_ID_KEY,
  USER_TOKEN_ENV_KEY
} from "./constants";

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
    return Cypress.env(USER_SESSION_ENV_KEY, sessionId);
  }

  return Cypress.env(USER_SESSION_ENV_KEY, null);
});

Cypress.Commands.add("dropSession", () => {
  const sessionId = Cypress.env(USER_SESSION_ENV_KEY);

  if (!sessionId) {
    return;
  }

  fetch(serverUrl.root + "/sandbox", {
    method: "DELETE",
    headers: { [USER_SERVER_SESSION_ID_KEY]: sessionId }
  }).catch(() => {
    Cypress.env(USER_SESSION_ENV_KEY, null);
  });
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
        [USER_SERVER_SESSION_ID_KEY]: Cypress.env(USER_SESSION_ENV_KEY),
        jwt: Cypress.env(USER_TOKEN_ENV_KEY)
      }
    });

    return client.mutate<TData, TVariables>(options);
  }
);
