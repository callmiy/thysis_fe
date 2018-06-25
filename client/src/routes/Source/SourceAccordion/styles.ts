import jss from "jss";
import preset from "jss-preset-default";

import { SimpleCss } from "../../../constants";

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
    overflow: "hidden"
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

  editSourceIcon: {
    position: "absolute",
    right: 25,
    top: -30,
    padding: "0px 10px 10px 30px"
  },

  quotesAccordion: {
    overflowY: "auto",
    overflowX: "hidden",
    wordWrap: "break-word",
    wordBreak: "break-all"
  },

  quotesAccordionStyle: {
    padding: "0em 0.2em 0.8em"
  }
} as SimpleCss;

export const rootStyle = styles.rootStyle;
export const quotesAccordion = styles.quotesAccordion;
export const { classes } = jss.createStyleSheet(styles).attach();
