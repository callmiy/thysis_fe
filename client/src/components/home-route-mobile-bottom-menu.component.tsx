import React from "react";
import { Menu, Icon } from "semantic-ui-react";

export default class NewQuoteMobileBottomMenu extends React.PureComponent {
  render() {
    return (
      <Menu
        pointing={true}
        icon="labeled"
        borderless={true}
        widths={3}
        style={{
          flexShrink: 0, // don't allow flexbox to shrink it
          borderRadius: 0, // clear semantic-ui style
          margin: 0 // clear semantic-ui style
        }}
      >
        <Menu.Item>
          <Icon name="tag" />
          New Tag
        </Menu.Item>

        <Menu.Item>
          <Icon name="user" />
          New Source
        </Menu.Item>

        <Menu.Item>
          <Icon name="numbered list" />
          Tags
        </Menu.Item>
      </Menu>
    );
  }
}
