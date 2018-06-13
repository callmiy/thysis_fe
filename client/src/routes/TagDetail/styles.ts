import jss from "jss";
import preset from "jss-preset-default";

import { ROOT_CONTAINER_STYLE } from "../../constants";
import { SimpleCss } from "../../constants";

jss.setup(preset());

export const styles = {
  tagDetailRoot: ROOT_CONTAINER_STYLE,

  tagDetailMain: {
    flex: 1,
    overflowX: "hidden",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "0 5px 15px 10px"
  },

  tagText: {
    padding: "3px 5px 10px 5px",
    marginBottom: 0
  }
} as SimpleCss;

export const { classes } = jss.createStyleSheet(styles).attach();
