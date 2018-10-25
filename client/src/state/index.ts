import { withClientState } from "apollo-link-state";
import { InMemoryCache } from "apollo-cache-inmemory";

import { UserFragment } from "./../graphql/gen.types";
import { USER_LOCAL_STORAGE_KEY } from "./../constants";

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

export const initState = (cache: InMemoryCache) => {
  return withClientState({
    cache,
    resolvers: {
      Mutation: {
        updateNetworkStatus
      }
    },
    defaults: {
      user: userFromLocalStorage()
    }
  });
};

export const userFromLocalStorage = (): UserFragment | null => {
  const user = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};

export const userToLocalStorage = (user: UserFragment) => {
  localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
};
