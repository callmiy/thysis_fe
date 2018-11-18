import * as React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import update from "immutability-helper";

import Header from "src/components/Header";
import { makeNewQuoteURL } from "src/routes/util";
import { SEARCH_QUOTES_URL } from "src/routes/util";
import TagsModal from "src/components/TagsModal";
import SourcesModal from "src/components/SourcesModal";
import NewTagModalForm from "src/components/NewTagModalForm";
import SourceModal from "src/components/SourceModal";
import HomeNewAuthor from "./HomeNewAuthor";
import NewSourceTypeModal from "src/components/NewSourceTypeModal";
import styles from "./styles";
import { classes } from "./styles";
import { Props } from "./home";
import { State } from "./home";
import { MenuItem } from "src/components/side-bar-menu";
import AppSideBar from "src/components/AppSidebar";

export class Home extends React.Component<Props, State> {
  state: State = {
    modalOpened: {}
  };

  constructor(props: Props) {
    super(props);
  }

  render() {
    const { user, currentProject, staleToken } = this.props;
    const newAuthorModalProps = {
      open: this.state.modalOpened[MenuItem.NEW_AUTHOR],
      dismissModal: this.toggleModalOpen(MenuItem.NEW_AUTHOR, false),
      style: { marginTop: 0 }
    };

    const newSourceModalProps = {
      open: this.state.modalOpened[MenuItem.NEW_SOURCE],
      dismissModal: this.toggleModalOpen(MenuItem.NEW_SOURCE, false),
      style: { marginTop: 0 },
      currentProject
    };

    return (
      <AppSideBar>
        <div className={`${classes.homeRoot}`}>
          <Header title="Home" showSideBarTrigger={true} />

          <div className={classes.homeMain}>
            <Menu
              pointing={true}
              compact={true}
              icon="labeled"
              style={styles.menu}
              id="menu-items"
            >
              <Menu.Item
                style={styles.menuAnchor}
                as={NavLink}
                to={SEARCH_QUOTES_URL}
              >
                <Icon name="search" />
                Search
              </Menu.Item>

              <Menu.Item
                style={styles.menuAnchor}
                as={NavLink}
                to={makeNewQuoteURL()}
              >
                <Icon name="quote right" />
                New Quote
              </Menu.Item>

              <Menu.Item
                style={styles.menuAnchor}
                onClick={this.toggleModalOpen(MenuItem.TAG_LIST, true)}
              >
                <Icon name="numbered list" />
                List Tags
              </Menu.Item>

              <Menu.Item
                style={styles.menuAnchor}
                onClick={this.toggleModalOpen(MenuItem.SOURCE_LIST, true)}
              >
                <Icon name="numbered list" />
                List Sources
              </Menu.Item>

              <Menu.Item
                style={styles.menuAnchor}
                onClick={this.toggleModalOpen(MenuItem.NEW_AUTHOR, true)}
              >
                <Icon name="user" />
                New Author
              </Menu.Item>

              <Menu.Item
                style={styles.menuAnchor}
                onClick={this.toggleModalOpen(MenuItem.NEW_TAG, true)}
              >
                <Icon name="tag" />
                New Tag
              </Menu.Item>

              <Menu.Item
                style={styles.menuAnchor}
                onClick={this.toggleModalOpen(MenuItem.NEW_SOURCE, true)}
              >
                <Icon name="user" />
                New Source
              </Menu.Item>

              <Menu.Item
                style={styles.menuAnchor}
                onClick={this.toggleModalOpen(MenuItem.NEW_SOURCE_TYPE, true)}
              >
                <Icon name="tree" />
                New Source Type
              </Menu.Item>
            </Menu>
          </div>

          {this.state.modalOpened[MenuItem.TAG_LIST] && (
            <TagsModal
              open={this.state.modalOpened[MenuItem.TAG_LIST]}
              dismissModal={this.toggleModalOpen(MenuItem.TAG_LIST, false)}
            />
          )}

          {this.state.modalOpened[MenuItem.SOURCE_LIST] && (
            <SourcesModal
              open={this.state.modalOpened[MenuItem.SOURCE_LIST]}
              dismissModal={this.toggleModalOpen(MenuItem.SOURCE_LIST, false)}
            />
          )}

          {this.state.modalOpened[MenuItem.NEW_AUTHOR] && (
            <HomeNewAuthor
              childProps={newAuthorModalProps}
              newSourceModalProps={newSourceModalProps}
            />
          )}

          {this.state.modalOpened[MenuItem.NEW_TAG] && (
            <NewTagModalForm
              open={this.state.modalOpened[MenuItem.NEW_TAG]}
              dismissModal={this.toggleModalOpen(MenuItem.NEW_TAG, false)}
              style={{ marginTop: 0 }}
            />
          )}

          {this.state.modalOpened[MenuItem.NEW_SOURCE] && (
            <SourceModal {...newSourceModalProps} />
          )}

          {this.state.modalOpened[MenuItem.NEW_SOURCE_TYPE] && (
            <NewSourceTypeModal
              open={this.state.modalOpened[MenuItem.NEW_SOURCE_TYPE]}
              dismissModal={this.toggleModalOpen(
                MenuItem.NEW_SOURCE_TYPE,
                false
              )}
              style={{ marginTop: 0 }}
              user={user}
              staleToken={staleToken}
            />
          )}
        </div>
      </AppSideBar>
    );
  }

  toggleModalOpen = (name: MenuItem, open: boolean) => () => {
    this.setState(s =>
      update(s, {
        modalOpened: {
          $set: {}
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

export default Home;
