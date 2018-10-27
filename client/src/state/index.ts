import { withClientState } from "apollo-link-state";
import { InMemoryCache } from "apollo-cache-inmemory";

import { UserFragment } from "./../graphql/gen.types";
import { TOKEN_KEY } from "./../constants";

type ClientStateFn<TVariables> = (
  fieldName: string,
  variables: TVariables,
  context: { cache: InMemoryCache }
) => void;

const updateNetworkStatus: ClientStateFn<{
  isConnected: boolean;
}> = (_, { isConnected }, { cache }) => {
  const data = {
    networkStatus: {
      __typename: "NetworkStatus",
      isConnected
    }
  };
  cache.writeData({ data });
  return null;
};

const userMutation: ClientStateFn<{
  user: UserFragment;
}> = (_, { user }, { cache }) => {
  const data = { user, staleToken: null };
  cache.writeData({ data });
  storeToken(user.jwt);
  return null;
};

export const initState = (cache: InMemoryCache) => {
  return withClientState({
    cache,
    resolvers: {
      Mutation: {
        updateNetworkStatus,
        user: userMutation
      }
    },
    defaults: {
      staleToken: getToken(),
      user: null
    }
  });
};

export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY) || null;

export const storeToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};
