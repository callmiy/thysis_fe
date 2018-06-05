import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { List } from "semantic-ui-react";

import { QuoteFromtagFragFragment } from "../graphql/gen.types";
import { SimpleCss } from "../constants";

jss.setup(preset());

const styles = {
  quoteItem: {
    wordBreak: "break-all",
    "&:first-of-type": {
      marginTop: "10px"
    }
  },

  quoteText: {
    cursor: "pointer"
  },

  quoteDate: {
    display: "flex",
    flexDirection: "row-reverse"
  },

  sourceDisplay: {
    fontStyle: "italic",
    fontSize: "0.9em",
    marginTop: "10px"
  }
} as SimpleCss;

const { classes } = jss.createStyleSheet(styles).attach();

export default ({
  id,
  text,
  date,
  source
}: Pick<QuoteFromtagFragFragment, "id" | "text" | "date" | "source">) => {
  return (
    <List.Item key={id} className={`${classes.quoteItem}`}>
      <List.Content>
        <List.Header className={`${classes.quoteText}`}>{text}</List.Header>

        {source && (
          <div className={`${classes.sourceDisplay}`}>{source.display}</div>
        )}

        <List.Description style={styles.quoteDate}>{date}</List.Description>
      </List.Content>
    </List.Item>
  );
};
