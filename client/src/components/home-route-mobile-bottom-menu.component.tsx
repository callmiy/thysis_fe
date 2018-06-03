import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import update from "immutability-helper";

import NewTagModalForm from "./new-tag-modal-form.component";
import NewSourceModal from "./new-source-modal.component";

// import { SimpleCss } from "../constants";

const styles = {
  container: {
    flexShrink: 0, // don't allow flexbox to shrink it
    borderRadius: 0, // clear semantic-ui style
    margin: 0 // clear semantic-ui style
  },

  modal: {
    marginTop: "20%"
  }
}; // as SimpleCss;

interface NewQuoteMobileBottomMenuState {
  modalOpened: {
    newTag: boolean;
    newSource: boolean;
  };
}

const initialModalOpened = {
  newTag: false,
  newSource: false
};

// tslint:disable-next-line:max-classes-per-file
export default class NewQuoteMobileBottomMenu extends React.Component<
  {},
  NewQuoteMobileBottomMenuState
> {
  state: NewQuoteMobileBottomMenuState = {
    modalOpened: initialModalOpened
  };

  constructor(props: {}) {
    super(props);

    ["toggleModalOpen"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  render() {
    return (
      <div style={styles.container}>
        <NewTagModalForm
          style={styles.modal}
          open={this.state.modalOpened.newTag}
          dismissModal={this.toggleModalOpen("newTag", false)}
        />

        <NewSourceModal
          style={styles.modal}
          open={this.state.modalOpened.newSource}
          dismissModal={this.toggleModalOpen("newSource", false)}
        />

        <Menu
          pointing={true}
          icon="labeled"
          borderless={true}
          widths={3}
          style={styles.container}
        >
          <Menu.Item onClick={this.toggleModalOpen("newTag", true)}>
            <Icon name="tag" />
            New Tag
          </Menu.Item>

          <Menu.Item onClick={this.toggleModalOpen("newSource", true)}>
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

  toggleModalOpen = (name: string, open: boolean) => () => {
    this.setState(s =>
      update(s, {
        modalOpened: {
          $set: initialModalOpened
        }
      })
    );

    this.setState(s =>
      update(s, {
        modalOpened: {
          [name]: {
            $set: open
          }
        }
      })
    );
  };
}
