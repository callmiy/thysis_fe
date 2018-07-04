import jss from "jss";
import preset from "jss-preset-default";

import { ROOT_CONTAINER_STYLE } from "../../constants";
import { SimpleCss } from "../../constants";
import mainContentStyle from "../../utils/main-content-centered-style.util";

jss.setup(preset());

const resultRowItemStyle = {
  borderTop: ["none", "!important;"]
  // tslint:disable-next-line:no-any
} as any;

export const styles = {
  root: ROOT_CONTAINER_STYLE,

  input: {
    margin: "0 5px"
  },

  mainContent: {
    ...mainContentStyle,
    margin: "5px 3px 0 0"
  },

  resultContainer: {
    margin: "0",
    overflowY: "auto",
    wordBreak: "break-all"
  },

  result: {
    marginTop: "15px;",
    "&.first-of-type": {
      marginTop: "0;"
    },
    "& .ui.list>a.item": {
      color: "initial"
    }
  },

  resultRowHeaderContainer: {
    textAlign: "center"
  },

  resultRowHeader: {
    display: "inline-block",
    minWidth: "40%",
    boxShadow: "0 1px 1px -1px black;"
  },

  resultRowItem: {
    ...resultRowItemStyle,
    borderBottom: "1px solid #22242626",
    marginTop: 8
  }
} as SimpleCss;

export default styles;

export const { classes } = jss.createStyleSheet(styles).attach();
