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

export const NEW_QUOTE_URL = "/new-quote/:sourceId?";
export const makeNewQuoteURL = (id?: string) => {
  return NEW_QUOTE_URL.replace(":sourceId?", id || "");
};

export const SEARCH_QUOTES_URL = "/search/quotes";

// END ROUTE URLS

let titleEl = document.getElementById("gasification-title");

export const setTitle = (title?: string) => {
  if (!titleEl) {
    titleEl = document.getElementById("gasification-title");
  }

  if (titleEl) {
    titleEl.innerText = title ? `Gasifier - ${title}` : "Gasifier";
  }
};
