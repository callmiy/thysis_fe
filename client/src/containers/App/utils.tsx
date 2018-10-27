import jss from "jss";
import preset from "jss-preset-default";

import { ROOT_CONTAINER_STYLE } from "../../constants";
import { SimpleCss } from "../../constants";

jss.setup(preset());

const styles = {
  app: ROOT_CONTAINER_STYLE,

  loadingIndicator: {
    display: "flex",
    flex: 1,
    "justify-content": "center",
    "align-items": "center",
    background: "#757575",
    color: "#fff",
    "font-size": "1.5rem",
    height: "100%"
  }
} as SimpleCss;

export const { classes } = jss.createStyleSheet(styles).attach();
