import jss from "jss";
import preset from "jss-preset-default";
import { CSSProperties } from "react";

import { SimpleCss } from "../../constants";
import { ERROR_COLOR } from "../../utils/colors";

jss.setup(preset());

export const styles: SimpleCss = {
  modal: {
    marginTop: 0,
    background: "#fff"
  },

  form: {
    height: "100%",
    overflowX: "hidden",
    overflowY: "auto",
    paddingRight: 10
  },

  fieldWrapper: {
    marginBottom: "1em"
  },

  formButtonsContainer: {
    display: "flex",
    marginBottom: "15px"
  },

  submitButton: {
    margin: "0 15px"
  },

  successCard: {
    backgroundColor: "#fcfff5",
    boxShadow: "0 0 0 1px #a3c293 inset, 0 0 0 0 transparent",
    margin: "auto"
  },

  errorMessage: {
    position: `relative`,
    top: -10,
    color: ERROR_COLOR
  }
};

export const modalStyle = styles.modal as CSSProperties;

export const { classes } = jss.createStyleSheet(styles).attach();
