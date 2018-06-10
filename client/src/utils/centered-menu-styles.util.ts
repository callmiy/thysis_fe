export const centeredMenuStyles = {
  mainParentContainer: {
    display: "flex"
  },

  menu: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    minWidth: "80%",
    margin: "auto",
    flex: "1",
    overflowY: "auto"
  },

  menuAnchor: {
    margin: "10px",
    border: "1px solid #22242626",
    boxShadow: "0 1px 2px 0 rgba(34,36,38,.15)",
    borderRadius: ".28571429rem",
    cursor: "pointer",

    "&:before, &:after": {
      display: "none"
    }
  }
};

export default centeredMenuStyles;
