import { withClientState } from "apollo-link-state";
import { InMemoryCache } from "apollo-cache-inmemory";

import { UserFragment } from "./../graphql/gen.types";
import { ProjectFragment } from "./../graphql/gen.types";
import { TOKEN_KEY } from "./../constants";
import { CURRENT_PROJECT_KEY } from "./../constants";
import { State as SearchComponentState } from "../components/SearchComponent/search-component";

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
  user: UserFragment | null;
}> = (_, { user }, { cache }) => {
  const data = { user, staleToken: null };

  if (user) {
    cache.writeData({ data });
    storeToken(user.jwt);
  } else {
    // MEANS WE HAVE LOGGED OUT
    cache.writeData({
      data: {
        ...data,
        currentProject: null,
        searchComponentState: null
      }
    });
    clearToken();
    clearProject();
  }

  return null;
};

const projectMutation: ClientStateFn<{
  currentProject: ProjectFragment;
}> = (_, { currentProject }, { cache }) => {
  const data = { currentProject };
  cache.writeData({ data });

  storeProject(currentProject);

  return null;
};

const searchComponentStateMutation: ClientStateFn<{
  searchComponentState: SearchComponentState;
}> = (_, { searchComponentState: d }, { cache }) => {
  const toSave = {
    searchText: d.searchText || "",
    searchLoading: d.searchLoading || false,
    result: d.result || null,
    searchError: d.searchError || null,
    __typename: "SearchComponentState"
  };

  const data = {
    searchComponentState: toSave
  };

  cache.writeData({ data });

  return null;
};

export const initState = (cache: InMemoryCache) => {
  return withClientState({
    cache,
    resolvers: {
      Mutation: {
        updateNetworkStatus,
        user: userMutation,
        currentProject: projectMutation,
        searchComponentState: searchComponentStateMutation
      }
    },
    defaults: {
      staleToken: getToken(),
      user: null,
      currentProject: getProject(),
      searchComponentState: null
    }
  });
};

export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY) || null;

const storeToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);

const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const getProject = (): ProjectFragment | null => {
  const project = localStorage.getItem(CURRENT_PROJECT_KEY);
  return project ? JSON.parse(project) : null;
};

const storeProject = async (project: ProjectFragment) =>
  localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));

const clearProject = () => localStorage.removeItem(CURRENT_PROJECT_KEY);
