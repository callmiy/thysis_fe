import { SimpleStyle } from "jss/css";

export const ROOT_URL = "/";
export const ROOT_URL_APP = "/app";
export const TAG_DETAIL_URL = ROOT_URL_APP + "/:id";
export const makeTagDetailURL = (id: string) => {
  return TAG_DETAIL_URL.replace(":id", id);
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
