import { CSSProperties } from "react";
import jss from "jss";
import preset from "jss-preset-default";

import { ROOT_CONTAINER_STYLE } from "../../constants";
import { ERROR_COLOR } from "../../constants";
import mainContentStyle from "../../utils/main-content-centered-style.util";
import { SimpleCss } from "../../constants";

jss.setup(preset());

const submitButton = {
  marginLeft: ["20px", "!important"]
  // tslint:disable-next-line:no-any
} as any;

export const styles = {
  newQuoteRoot: {
    ...ROOT_CONTAINER_STYLE
  },

  mainContent: {
    ...mainContentStyle
  },

  quoteSourceDisplayContainer: {
    padding: "5px",
    margin: "0"
  },

  quoteSourceDisplay: {
    margin: "0",
    padding: "0",
    overflow: "hidden",
    maxHeight: "10vh"
  },

  quoteSourceLabel: {
    textAlign: "center",
    marginBottom: "5px",
    fontWeight: 100,
    fontSize: "1.1rem",
    fontStyle: "italic"
  },

  quoteLink: {
    textDecoration: "none",
    color: "initial",
    cursor: "pointer",
    "&:hover": {
      color: "initial"
    }
  },

  errorBorder: {
    borderColor: ERROR_COLOR
  },

  tagsField: {
    marginTop: "15px"
  },

  submitReset: {
    margin: "25px 0 40px 0",
    display: "flex",
    justifyContent: "center"
  },

  submitButton: { ...submitButton }
} as SimpleCss;

export default styles;

export const inlineStyle = styles as { [key: string]: CSSProperties };

export const { classes } = jss.createStyleSheet(styles).attach();
