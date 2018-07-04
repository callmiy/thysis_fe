import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../../constants";
import errorContainer from "../../utils/simple-error-styles.util";

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
    right: 15,
    color: "#01751c",
    zIndex: 10,
    fontWeight: 900,
    fontSize: "1.3em",

    "&:hover": {
      color: "#01751c"
    }
  },

  errorContainer: {
    ...errorContainer
  }
} as SimpleCss;

export const { classes } = jss.createStyleSheet(styles).attach();
