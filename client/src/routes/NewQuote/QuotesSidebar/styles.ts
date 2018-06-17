import { CSSProperties } from "react";
import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../../../constants";
import { ERROR_COLOR } from "../../../utils/colors";
import { ERROR_BG_COLOR } from "../../../utils/colors";

jss.setup(preset());

const styles = {
  pane: {
    flex: 1,
    overflowX: "hidden",
    overflowY: "auto",
    wordWrap: "break-word"
  },

  messageContainer: {
    display: "flex",
    padding: "10px",

    "&.error": {
      color: ERROR_COLOR,
      background: ERROR_BG_COLOR
    }
  },

  messageIcon: {
    marginRight: 15,
    fontSize: "1.5em"
  },

  messageHeader: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: "1.2em",
    marginBottom: 10
  },

  listItem: {
    cursor: "pointer"
  }
} as SimpleCss;

export const messageIconStyle = styles.messageIcon as CSSProperties;
export const { classes } = jss.createStyleSheet(styles).attach();
