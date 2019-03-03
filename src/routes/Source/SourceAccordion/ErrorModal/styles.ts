import jss from "jss";
import preset from "jss-preset-default";

import { ERROR_COLOR } from "../../../../utils/colors";
import { ERROR_BG_COLOR } from "../../../../utils/colors";
import { SimpleCss } from "../../../../constants";

jss.setup(preset());

const styles = {
  modal: {
    marginTop: "20px",
    maxHeight: "40%",
    maxWidth: 300
  },

  content: {
    background: ERROR_BG_COLOR,
    color: ERROR_COLOR
  },

  messageContainer: {
    flex: 1,
    display: "flex",
    padding: 10,
    fontSize: "1.3em"
  },

  messageIcon: {
    paddingRight: "10px",
    fontSize: "1.5em"
  },

  messageHeader: {
    fontWeight: 900,
    textAlign: "center"
  },

  buttonsContainer: {
    flexShrink: 0,
    padding: "10px 8px 5px 10px",
    borderTop: `1px solid ${ERROR_COLOR}`,
    textAlign: "right"
  },

  error: {
    flex: 1,
    padding: 20,
    textAlign: "center"
  }
} as SimpleCss;

export const modalStyle = styles.modal as React.CSSProperties;
export const contentStyle = styles.content as React.CSSProperties;
export const messageIconStyle = styles.messageIcon as React.CSSProperties;
export const errorStyle = styles.error as React.CSSProperties;

export const { classes } = jss.createStyleSheet(styles).attach();
