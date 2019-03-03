// ROUTE URLS

export const TAG_URL = "/tags/:id";
export const makeTagURL = (id: string) => {
  return TAG_URL.replace(":id", id);
};

export const SOURCE_URL = "/sources/:id";
export const makeSourceURL = (id: string) => {
  return SOURCE_URL.replace(":id", id);
};

export const QUOTE_URL = "/quotes/:id";
export const makeQuoteURL = (id: string) => {
  return QUOTE_URL.replace(":id", id);
};

export const AUTHOR_ROUTE_URL = "/authors/:id";
export const makeAuthorRouteURL = (id: string) => {
  return AUTHOR_ROUTE_URL.replace(":id", id);
};

export const ROOT_URL = "/:sourceId?";
export const makeNewQuoteURL = (id?: string) => {
  return ROOT_URL.replace(":sourceId?", id || "");
};

export const SEARCH_QUOTES_URL = "/search/quotes";

export const USER_REG_URL = "/auth/register";
export const LOGIN_URL = "/auth/login";
export const PROJECTS_URL = "/projects" as string;

export const PWD_RECOVERY_REQUEST_ROUTE = "/auth/request-pwd-recovery";

// END ROUTE URLS

let titleEl = document.getElementById("thysis-title");

export const setTitle = (title?: string) => {
  if (!titleEl) {
    titleEl = document.getElementById("thysis-title");
  }

  if (titleEl) {
    titleEl.innerText = title ? `Thysis | ${title}` : "Thysis";
  }
};
