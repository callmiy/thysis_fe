import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../../constants";

jss.setup(preset());

export const styles = {
  SourceRoot: {
    height: "100%",
    overflow: "hidden",
    position: "relative",
    flex: 1,
    display: "grid",
    gridTemplateAreas: `
      "header"
      "main"
      "bottom-menu";
    `,
    gridTemplateRows: "auto 1fr auto",
    gridTemplateColumns: "100%"
  },

  rootHeader: {
    gridArea: "header"
  },

  sourceMain: {
    gridArea: "main",
    overflow: "hidden",
    position: "relative"
  },

  bottomMenu: {
    gridArea: "bottom-menu"
  },
  header: {
    flexShrink: 0,
    maxHeight: "15vh",
    overflow: "hidden",
    padding: "0 0 0 5px"
  },

  newQuoteButton: {
    position: "absolute",
    bottom: 15,
    right: 10
  }
} as SimpleCss;

export const { classes } = jss.createStyleSheet(styles).attach();
