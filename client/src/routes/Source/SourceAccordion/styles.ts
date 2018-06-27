import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../../../constants";
import { ERROR_COLOR } from "../../../utils/colors";

jss.setup(preset());

const styles = {
  accordion: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },

  rootStyle: {
    padding: ".5em 0.8em 1.5em"
  },

  root: {
    display: "grid",
    gridTemplateAreas: `
      "labels details"
    `,
    gridTemplateColumns: "1fr 3fr",
    overflow: "hidden",

    "&.authors": {
      overflow: "initial"
    }
  },

  labels: {
    gridArea: "labels"
  },

  details: {
    gridArea: "details",
    paddingLeft: 15
  },

  detailsAccordionContent: {
    position: "relative",

    "&> div": {
      marginBottom: 15
    }
  },

  toggleEditView: {
    position: "absolute",
    right: 0,
    top: -40,

    "&>.icon": {
      width: "3em",
      height: "3em",
      cursor: "pointer",

      "&.edit-icon": {
        padding: "15px 35px 10px 50px"
      },

      "&.editing-icon": {
        paddingTop: "15px"
      }
    }
  },

  quotesAccordion: {
    overflowY: "auto",
    overflowX: "hidden",
    wordWrap: "break-word",
    wordBreak: "break-all"
  },

  quotesAccordionStyle: {
    padding: "0em 0.2em 0.8em"
  },

  errorMessage: {
    color: ERROR_COLOR
  },

  error: {
    "&>.ui.fluid.input>input": {
      color: ERROR_COLOR,
      borderColor: ERROR_COLOR
    }
  }
} as SimpleCss;

export const rootStyle = styles.rootStyle;
export const quotesAccordion = styles.quotesAccordion;
export const { classes } = jss.createStyleSheet(styles).attach();
