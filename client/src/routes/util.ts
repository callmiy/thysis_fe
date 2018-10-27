// ROUTE URLS
export const ROOT_URL = "/";

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

export const NEW_QUOTE_URL = "/new-quote/:sourceId?";
export const makeNewQuoteURL = (id?: string) => {
  return NEW_QUOTE_URL.replace(":sourceId?", id || "");
};

export const SEARCH_QUOTES_URL = "/search/quotes";

export const USER_REG_URL = "/auth/register";
export const LOGIN_URL = "/auth/login";

// END ROUTE URLS

let titleEl = document.getElementById("thises-title");

export const setTitle = (title?: string) => {
  if (!titleEl) {
    titleEl = document.getElementById("thises-title");
  }

  if (titleEl) {
    titleEl.innerText = title ? `Thises | ${title}` : "Thises";
  }
};
