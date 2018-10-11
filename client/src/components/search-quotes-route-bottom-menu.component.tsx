import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import update from "immutability-helper";
import { NavLink } from "react-router-dom";

import SourceModal from "./SourceModal";
import TagsModal from "./TagsModal";
import { MenuItemNames } from "../constants";
import { makeNewQuoteURL } from "../routes/util";
import { ROOT_URL } from "../routes/util";

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

interface SearchQuotesMenuState {
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

class SearchQuotesMenu extends React.Component<{}, SearchQuotesMenuState> {
  state: SearchQuotesMenuState = {
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

          <Menu.Item style={{}} as={NavLink} to={makeNewQuoteURL()}>
            <Icon name="quote right" />
            New Quote
          </Menu.Item>

          <Menu.Item
            onClick={this.toggleModalOpen(MenuItemNames.NEW_SOURCE, true)}
          >
            <Icon name="user" />
            New Source
          </Menu.Item>

          <Menu.Item
            onClick={this.toggleModalOpen(MenuItemNames.TAG_LIST, true)}
          >
            <Icon name="numbered list" />
            List Tags
          </Menu.Item>
        </Menu>

        {this.state.modalOpened[MenuItemNames.NEW_SOURCE] && (
          <SourceModal
            open={this.state.modalOpened[MenuItemNames.NEW_SOURCE]}
            dismissModal={this.toggleModalOpen(MenuItemNames.NEW_SOURCE, false)}
            style={{ marginTop: 0 }}
          />
        )}

        {this.state.modalOpened[MenuItemNames.TAG_LIST] && (
          <TagsModal
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

export default SearchQuotesMenu;
