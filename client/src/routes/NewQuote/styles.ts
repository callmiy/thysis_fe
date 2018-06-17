import { CSSProperties } from "react";
import jss from "jss";
import preset from "jss-preset-default";

import { ERROR_COLOR } from "../../utils/colors";
import mainContentStyle from "../../utils/main-content-centered-style.util";
import { SimpleCss } from "../../constants";

jss.setup(preset());

const submitButton = {
  marginLeft: ["20px", "!important"]
  // tslint:disable-next-line:no-any
} as any;

export const styles = {
  newQuoteRoot: {
    height: "100%",
    display: "grid",
    gridTemplateAreas: `
      "rootHeader"
      "inner"
      "bottomMenu"
    `,
    gridTemplateRows: "auto minmax(50%, 1fr) auto",
    gridTemplateColumns: "100%"
  },

  rootInner: {
    gridArea: "inner",

    "&>div": {
      overflow: "hidden"
    },

    "@media (min-width: 700px)": {
      display: "grid",
      gridTemplateAreas: `
        "formWithHeader quotesSidebar"
      `,
      gridTemplateColumns: "minmax(400px, 550px) minmax(40%, 1fr)",
      gridColumnGap: "10px"
    }
  },

  formWithHeader: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gridArea: "formWithHeader",

    "@media (min-width: 700px)": {
      height: "initial",
      boxShadow: "1px -1px 6px -1px #9e9898"
    }
  },

  quotesSidebar: {
    display: "none",
    gridArea: "quotesSidebar",
    margin: "5px 5px 0",

    "@media (min-width: 700px)": {
      display: "flex",
      flexDirection: "column"
    }
  },

  rootHeader: {
    gridArea: "rootHeader"
  },

  bottomMenu: {
    gridArea: "bottomMenu"
  },

  mainContent: {
    ...mainContentStyle
  },

  quoteSourceDisplayContainer: {
    padding: "5px",
    margin: "0",
    flexShrink: 0
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
