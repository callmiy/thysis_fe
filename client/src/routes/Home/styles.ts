import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../../constants";
import { ROOT_CONTAINER_STYLE } from "../../constants";
import centeredMenuStyles from "../../utils/centered-menu-styles.util";

jss.setup(preset());

const styles = {
  homeRoot: ROOT_CONTAINER_STYLE,

  homeMain: centeredMenuStyles.mainParentContainer,

  menu: {
    ...centeredMenuStyles.menu,
    flex: "1",
    margin: "10px",
    overflowY: "auto"
  },

  menuAnchor: {
    ...centeredMenuStyles.menuAnchor,
    minWidth: "130px"
  },

  quotesContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: "10px",
    overflowX: "hidden",
    overflowY: "auto",
    opacity: 1,
    margin: "10px",
    border: "1px solid #dcd6d6",
    borderRadius: "3px",
    boxShadow: "5px 5px 2px -2px #757575",
    maxHeight: "70vh"
  }
} as SimpleCss;

export default styles;

export const { classes } = jss.createStyleSheet(styles).attach();
