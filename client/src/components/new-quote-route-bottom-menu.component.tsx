import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import update from "immutability-helper";
import { NavLink } from "react-router-dom";

import NewTagModalForm, {
  TagModalCreatedCb
} from "./new-tag-modal-form.component";
import NewSourceModal from "./new-source-modal.component";
import TagListModal from "./tag-list-modal.component";
import { MenuItemNames, ROOT_URL } from "../constants";

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

interface NewQuoteMenuState {
  modalOpened: {
    newTag: boolean;
    newSource: boolean;
    tagList: boolean;
  };
}

const initialModalOpened = {
  newTag: false,
  newSource: false,
  tagList: false
};

interface NewQuoteMenuProps {
  onTagCreated: TagModalCreatedCb;
}

class NewQuoteMenu extends React.Component<
  NewQuoteMenuProps,
  NewQuoteMenuState
> {
  state: NewQuoteMenuState = {
    modalOpened: initialModalOpened
  };

  render() {
    return (
      <div style={styles.container}>
        <Menu
          pointing={true}
          compact={true}
          icon="labeled"
          style={styles.container}
          widths={4}
        >
          <Menu.Item style={{ background: "none" }} as={NavLink} to={ROOT_URL}>
            <Icon name="home" />
            Home
          </Menu.Item>

          <Menu.Item
            onClick={this.toggleModalOpen(MenuItemNames.NEW_SOURCE, true)}
          >
            <Icon name="user" />
            New Source
          </Menu.Item>

          <Menu.Item
            onClick={this.toggleModalOpen(MenuItemNames.NEW_TAG, true)}
          >
            <Icon name="tag" />
            New Tag
          </Menu.Item>

          <Menu.Item
            onClick={this.toggleModalOpen(MenuItemNames.TAG_LIST, true)}
          >
            <Icon name="numbered list" />
            List Tags
          </Menu.Item>
        </Menu>

        {this.state.modalOpened[MenuItemNames.NEW_SOURCE] && (
          <NewSourceModal
            open={this.state.modalOpened[MenuItemNames.NEW_SOURCE]}
            dismissModal={this.toggleModalOpen(MenuItemNames.NEW_SOURCE, false)}
            style={{ marginTop: 0 }}
          />
        )}

        {this.state.modalOpened[MenuItemNames.NEW_TAG] && (
          <NewTagModalForm
            open={this.state.modalOpened[MenuItemNames.NEW_TAG]}
            dismissModal={this.toggleModalOpen(MenuItemNames.NEW_TAG, false)}
            style={{ marginTop: 0 }}
            onTagCreated={this.props.onTagCreated}
          />
        )}

        {this.state.modalOpened[MenuItemNames.TAG_LIST] && (
          <TagListModal
            open={this.state.modalOpened[MenuItemNames.TAG_LIST]}
            dismissModal={this.toggleModalOpen(MenuItemNames.TAG_LIST, false)}
          />
        )}
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

export default NewQuoteMenu;
