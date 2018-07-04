import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../../constants";
import errorContainer from "../../utils/simple-error-styles.util";

jss.setup(preset());

export const styles = {
  modal: {
    overflow: "hidden",
    marginTop: "-100px"
  },

  content: {
    wordWrap: "break-word",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden"
  },

  modalClose: {
    flexShrink: 0,
    fontWeight: 900,
    fontSize: "2rem",
    textAlign: "right",
    cursor: "pointer"
  },

  list: {
    background: "#fff",
    padding: "8px",
    flex: 1,
    overflowY: "auto",
    marginTop: 0,
    border: "1px solid #dad8d8"
  },

  listItem: {
    cursor: "pointer"
  },

  errorContainer: {
    ...errorContainer
  }
} as SimpleCss;

export default styles;

export const modalStyle = styles.modal as React.CSSProperties;

export const { classes } = jss.createStyleSheet(styles).attach();
