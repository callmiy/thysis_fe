import jss from "jss";
import preset from "jss-preset-default";

jss.setup(preset());

export const styles = {
  modal: {
    marginTop: 0,
    background: "#fff"
  },

  formButtonsContainer: {
    display: "flex"
  },

  submitButton: {
    margin: "0 15px"
  },

  successCard: {
    backgroundColor: "#fcfff5",
    boxShadow: "0 0 0 1px #a3c293 inset, 0 0 0 0 transparent",
    margin: "auto"
  }
};

export const { classes } = jss.createStyleSheet(styles).attach();