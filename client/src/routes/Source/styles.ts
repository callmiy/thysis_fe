import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../../constants";
import centeredMenuStyles from "../../utils/centered-menu-styles.util";

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
    overflow: "hidden"
  },

  bottomMenu: {
    gridArea: "bottom-menu"
  },

  menu: {
    ...centeredMenuStyles.menu
  },

  menuAnchor: {
    ...centeredMenuStyles.menuAnchor
  },

  quotesContainer: {
    position: "absolute",
    overflowX: "hidden",
    overflowY: "auto",
    opacity: 1,
    margin: "10px",
    border: "1px solid #dcd6d6",
    borderRadius: "3px",
    boxShadow: "5px 5px 2px -2px #757575",
    maxHeight: "60vh",
    minWidth: "90%",
    display: "flex",
    flexDirection: "column"
  },

  quotesCloseButton: {
    fontSize: "2em",
    fontWeight: 900,
    padding: "0 3px 5px 30px",
    cursor: "pointer",
    flexShrink: 0,
    textAlign: "right",
    marginTop: "0"
  },

  quotesList: {
    overflowY: "auto",
    marginTop: 0,
    padding: "0 5px 5px 5px",
    marginRight: "-50px",
    paddingRight: "50px"
  },

  header: {
    flexShrink: 0,
    maxHeight: "15vh",
    overflow: "hidden",
    padding: "0 0 0 5px"
  }
} as SimpleCss;

export const { classes } = jss.createStyleSheet(styles).attach();
