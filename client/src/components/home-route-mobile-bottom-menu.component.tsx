import React from "react";
import { Menu, Icon } from "semantic-ui-react";

import NewTagModalForm from "./new-tag-modal-form.component";

// import { SimpleCss } from "../constants";

const styles = {
  container: {
    flexShrink: 0, // don't allow flexbox to shrink it
    borderRadius: 0, // clear semantic-ui style
    margin: 0 // clear semantic-ui style
  },

  newTagModalForm: {
    marginTop: "50%"
  }
}; // as SimpleCss;

interface NewQuoteMobileBottomMenuState {
  newTagOpened: boolean;
}

// tslint:disable-next-line:max-classes-per-file
export default class NewQuoteMobileBottomMenu extends React.Component<
  {},
  NewQuoteMobileBottomMenuState
> {
  state: NewQuoteMobileBottomMenuState = {
    newTagOpened: false
  };

  constructor(props: {}) {
    super(props);

    ["toggleNewTagModal"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  render() {
    return (
      <div style={styles.container}>
        <NewTagModalForm
          open={this.state.newTagOpened}
          dismissModal={this.toggleNewTagModal(false)}
        />
        <Menu
          pointing={true}
          icon="labeled"
          borderless={true}
          widths={3}
          style={styles.container}
        >
          <Menu.Item onClick={this.toggleNewTagModal(true)}>
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
      </div>
    );
  }

  toggleNewTagModal = (value: boolean) => () =>
    this.setState(s => ({ ...s, newTagOpened: value }));
}
