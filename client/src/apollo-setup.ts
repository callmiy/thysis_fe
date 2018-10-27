import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, NextLink } from "apollo-link";
import { Operation } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";

import { initState } from "./state";
import { getToken } from "./state";

const HTTP_URL = process.env.REACT_APP_API_URL || "";

let httpLink;
httpLink = new HttpLink({ uri: HTTP_URL }) as ApolloLink;
httpLink = middlewareAuthLink().concat(httpLink);
httpLink = middlewareErrorLink().concat(httpLink);

if (process.env.NODE_ENV !== "production") {
  httpLink = middlewareLoggerLink(httpLink);
}

const cache = new InMemoryCache();

export const client = new ApolloClient({
  cache,
  link: ApolloLink.from([initState(cache), httpLink])
});

export default client;

// HELPER FUNCTIONS

function middlewareAuthLink() {
  return new ApolloLink((operation, forward) => {
    const token = getToken();

    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`
        }
      });
    }

    return forward ? forward(operation) : null;
  });
}

const getNow = () => {
  const n = new Date();
  return `${n.getHours()}:${n.getMinutes()}:${n.getSeconds()}`;
};

function middlewareLoggerLink(l: ApolloLink) {
  const processOperation = (operation: Operation) => ({
    query: operation.query.loc ? operation.query.loc.source.body : {},
    variables: operation.variables
  });

  const logger = new ApolloLink((operation, forward: NextLink) => {
    const operationName = `Apollo operation: ${operation.operationName}`;

    // tslint:disable-next-line:no-console
    console.log(
      "\n\n\n",
      getNow(),
      `=============================${operationName}========================\n`,
      processOperation(operation),
      `\n=========================End ${operationName}=========================`
    );

    if (!forward) {
      return forward;
    }

    const fop = forward(operation);

    if (fop.map) {
      return fop.map(response => {
        // tslint:disable-next-line:no-console
        console.log(
          "\n\n\n",
          getNow(),
          `==============Received response from ${operationName}============\n`,
          response,
          `\n==========End Received response from ${operationName}=============`
        );
        return response;
      });
    }

    return fop;
  });

  return logger.concat(l);
}

function middlewareErrorLink() {
  return onError(({ graphQLErrors, networkError, response, operation }) => {
    // tslint:disable-next-line:ban-types
    const loggError = (errorName: string, obj: Object) => {
      if (process.env.NODE_ENV === "production") {
        return;
      }

      const operationName = `[${errorName} error] from Apollo operation: ${
        operation.operationName
      }`;

      // tslint:disable-next-line:no-console
      console.log(
        "\n\n\n",
        getNow(),
        `============================${operationName}=======================\n`,
        obj,
        `\n====================End ${operationName}============================`
      );
    };

    if (response) {
      loggError("Response", response);
    }

    if (networkError) {
      loggError("Network", networkError);
    }
  });
}
