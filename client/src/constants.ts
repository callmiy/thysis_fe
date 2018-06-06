import { SimpleStyle } from "jss/css";

export const ROOT_URL = "/";

export const TAG_URL = "/tags/:id";
export const makeTagURL = (id: string) => {
  return TAG_URL.replace(":id", id);
};

export const SOURCE_URL = "/sources/:id";
export const makeSourceURL = (id: string) => {
  return SOURCE_URL.replace(":id", id);
};

export const NEW_QUOTE_URL = "/quote/:sourceId?";
export const makeNewQuoteURL = (id: string) => {
  return NEW_QUOTE_URL.replace(":sourceId?", id);
};

export const POSITION_RELATIVE = "relative" as "relative";
export const POSITION_ABSOLUTE = "absolute" as "absolute";
export const FLEX_WRAP_WRAP = "wrap" as "wrap";
export const BORDER_COLLAPSE_SEPARATE = "separate" as "separate";
export const FLEX_DIRECTION_COLUMN = "column" as "column";
export const OVERFLOW_X_HIDDEN = "hidden" as "hidden";
export const OVERFLOW_Y_AUTO = "auto" as "auto";

export type SimpleCss = Record<string, SimpleStyle>;

export const ROOT_CONTAINER_STYLE = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  flex: 1
};

export const ERROR_COLOR = "#9f3a38";
