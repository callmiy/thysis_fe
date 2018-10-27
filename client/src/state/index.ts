import { withClientState } from "apollo-link-state";
import { InMemoryCache } from "apollo-cache-inmemory";

import { UserFragment } from "./../graphql/gen.types";
import { ProjectFragment } from "./../graphql/gen.types";
import { TOKEN_KEY } from "./../constants";
import { CURRENT_PROJECT_KEY } from "./../constants";

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

const projectMutation: ClientStateFn<{
  currentProject: ProjectFragment;
}> = (_, { currentProject }, { cache }) => {
  // tslint:disable-next-line:no-console
  console.log(
    `


  logging starts


  project mutation current`,
    currentProject,
    `

  logging ends


  `
  );

  const data = { currentProject };
  cache.writeData({ data });
  storeProject(currentProject);
  return null;
};

export const initState = (cache: InMemoryCache) => {
  return withClientState({
    cache,
    resolvers: {
      Mutation: {
        updateNetworkStatus,
        user: userMutation,
        currentProject: projectMutation
      }
    },
    defaults: {
      staleToken: getToken(),
      user: null,
      currentProject: getProject()
    }
  });
};

export const getToken = (): string | null =>
  localStorage.getItem(TOKEN_KEY) || null;

export const storeToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token);

export const getProject = (): ProjectFragment | null => {
  const project = localStorage.getItem(CURRENT_PROJECT_KEY);
  return project ? JSON.parse(project) : null;
};

export const storeProject = (project: ProjectFragment) =>
  localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
