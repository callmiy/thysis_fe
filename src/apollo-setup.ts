import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink, Operation } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import { CachePersistor } from "apollo-cache-persist";

import { getToken, stateLink } from "./state";

let cache: InMemoryCache;
let client: ApolloClient<{}>;
let persistor: CachePersistor<NormalizedCacheObject>;

interface BuildClientCache {
  uri: string;
  headers?: { [k: string]: string };
}

export function buildClientCache(
  { uri, headers }: BuildClientCache = {} as BuildClientCache
) {
  if (!cache) {
    cache = new InMemoryCache();
  }

  if (!client || headers) {
    let httpLink;
    httpLink = new HttpLink({
      uri
    }) as ApolloLink;
    httpLink = middlewareAuthLink(headers).concat(httpLink);
    httpLink = middlewareErrorLink().concat(httpLink);

    if (process.env.NODE_ENV !== "production") {
      httpLink = middlewareLoggerLink(httpLink);
    }

    client = new ApolloClient({
      cache,
      link: ApolloLink.from([stateLink(cache), httpLink])
    });
  }

  return { client, cache };
}

export default buildClientCache;

export async function persistCache(appCache: InMemoryCache) {
  if (!persistor) {
    persistor = new CachePersistor({
      cache: appCache,
      // tslint:disable-next-line: no-any
      storage: localStorage as any,
      key: "thysis-apollo-cache-persist"
    });

    const SCHEMA_VERSION = "3.1"; // Must be a string.
    const SCHEMA_VERSION_KEY = "thysis-apollo-schema-version";
    const currentVersion = localStorage.getItem(SCHEMA_VERSION_KEY);

    if (currentVersion === SCHEMA_VERSION) {
      // If the current version matches the latest version,
      // we're good to go and can restore the cache.
      await persistor.restore();
    } else {
      // Otherwise, we'll want to purge the outdated persisted cache
      // and mark ourselves as having updated to the latest version.
      await persistor.purge();
      localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
    }
  }

  return persistor;
}

export const resetClientAndPersistor = async (
  appClient: ApolloClient<{}>,
  appPersistor: CachePersistor<NormalizedCacheObject>
) => {
  await appPersistor.pause(); // Pause automatic persistence.
  await appPersistor.purge(); // Delete everything in the storage provider.
  await appClient.clearStore();
  await appPersistor.resume();
};

// HELPER FUNCTIONS

function middlewareAuthLink(headers: { [k: string]: string } = {}) {
  return new ApolloLink((operation, forward) => {
    const token = getToken();

    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`,
          ...headers
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
    query: operation.query.loc ? operation.query.loc.source.body : "",
    variables: operation.variables
  });

  const logger = new ApolloLink((operation, forward) => {
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
      return null;
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
    const logError = (errorName: string, obj: Object) => {
      if (process.env.NODE_ENV === "production") {
        return;
      }

      const operationName = `[${errorName} error] from Apollo operation: ${
        operation.operationName
      }`;

      // tslint:disable-next-line:no-console
      console.error(
        "\n\n\n",
        getNow(),
        `============================${operationName}=======================\n`,
        obj,
        `\n====================End ${operationName}============================`
      );
    };

    if (response) {
      logError("Response", response);
    }

    if (networkError) {
      logError("Network", networkError);
    }
  });
}
