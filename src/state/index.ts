import { withClientState } from "apollo-link-state";
import { InMemoryCache } from "apollo-cache-inmemory";

import { UserFragment } from "../graphql/gen.types";
import { ProjectFragment } from "../graphql/gen.types";
import { TOKEN_KEY } from "../constants";
import { CURRENT_PROJECT_KEY } from "../constants";
import { State as SearchComponentState } from "../components/SearchComponent/search-component";
import USER_QUERY, { UserLocalGqlData } from "./auth-user.local.query";
import { Variable as UserMutationVar } from "./user.local.mutation";

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

const userMutation: ClientStateFn<UserMutationVar> = async (
  _,
  { user },
  { cache }
) => {
  if (user) {
    cache.writeData({
      data: { user, staleToken: null, loggedOutUser: null }
    });
    storeToken(user.jwt);

    return user;
  }
  // MEANS WE HAVE LOGGED OUT. we store the current user as `loggedOutUser`
  // so we can pre-fill the sign in form with e.g. user email

  const { user: loggedOutUser } = {
    ...(cache.readQuery<UserLocalGqlData>({ query: USER_QUERY }) || {
      user: null
    })
  };

  const data = {
    user: null,
    staleToken: null,
    currentProject: null,
    searchComponentState: null
  } as {
    loggedOutUser?: UserFragment | null;
  };

  if (loggedOutUser) {
    // const { client } = buildClientCache();
    // const persistor = await persistCache(cache);
    // await resetClientAndPersistor(client, persistor);
    data.loggedOutUser = loggedOutUser;
  }

  await cache.writeData({
    data
  });
  clearToken();
  clearProject();

  return loggedOutUser;
};

const currentProjectMutation: ClientStateFn<{
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

export const stateLink = (appCache: InMemoryCache) => {
  return withClientState({
    cache: appCache,
    resolvers: {
      Mutation: {
        updateNetworkStatus,
        user: userMutation,
        currentProject: currentProjectMutation,
        searchComponentState: searchComponentStateMutation
      }
    },
    defaults: {
      staleToken: getToken(),
      user: null,
      currentProject: getProject(),
      searchComponentState: null,
      loggedOutUser: null
    }
  });
};

export default stateLink;

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || null;
}

function storeToken(token: string) {
  return localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  return localStorage.removeItem(TOKEN_KEY);
}

function getProject(): ProjectFragment | null {
  const project = localStorage.getItem(CURRENT_PROJECT_KEY);
  return project ? JSON.parse(project) : null;
}

async function storeProject(project: ProjectFragment) {
  return localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
}

function clearProject() {
  return localStorage.removeItem(CURRENT_PROJECT_KEY);
}
