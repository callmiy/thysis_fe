import * as React from "react";
import { Menu } from "semantic-ui-react";
import jss from "jss";
import preset from "jss-preset-default";

jss.setup(preset());

const headerStyles = {
  header: {
    flexShrink: 0, // don't allow flexbox to shrink it
    borderRadius: 0, // clear semantic-ui style
    margin: "0 0 10px 0" // clear semantic-ui style
  }
};

interface Props {
  title: string;
  styles?: React.CSSProperties;
}

export default ({ title, styles = {} }: Props) => {
  return (
    <Menu
      style={{ ...headerStyles.header, ...styles }}
      inverted={true}
      color="green"
      borderless={true}
    >
      <Menu.Item as="h2" header={true}>
        {title}
      </Menu.Item>
    </Menu>
  );
};
