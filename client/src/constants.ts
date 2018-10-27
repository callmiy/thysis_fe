import { SimpleStyle } from "jss/css";

export const POSITION_RELATIVE = "relative" as "relative";
export const POSITION_ABSOLUTE = "absolute" as "absolute";
export const FLEX_WRAP_WRAP = "wrap" as "wrap";
export const BORDER_COLLAPSE_SEPARATE = "separate" as "separate";
export const FLEX_DIRECTION_COLUMN = "column" as "column";
export const OVERFLOW_X_HIDDEN = "hidden" as "hidden";
export const OVERFLOW_Y_AUTO = "auto" as "auto";
export const TOKEN_KEY = "token";
export const CURRENT_PROJECT_KEY = "current-project";

export type SimpleCss = Record<string, SimpleStyle>;

export const ROOT_CONTAINER_STYLE = {
  height: "100%",
  display: "flex",
  flexDirection: FLEX_DIRECTION_COLUMN,
  flex: 1
};

export enum MenuItemNames {
  HOME = "home",
  NEW_TAG = "newTag",
  NEW_SOURCE = "newSource",
  TAG_LIST = "tagList",
  SOURCE_LIST = "sourceList"
}
