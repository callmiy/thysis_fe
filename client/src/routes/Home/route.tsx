import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import update from "immutability-helper";

import Header from "../../components/header.component";
import { makeNewQuoteURL } from "../../routes/util";
import { SEARCH_QUOTES_URL } from "../../routes/util";
import TagsModal from "../../components/TagsModal";
import SourcesModal from "../../components/SourcesModal";
import NewTagModalForm from "../../components/NewTagModalForm";
import SourceModal from "../../components/SourceModal";
import NewAuthorModal from "../../components/NewAuthorModal";
import styles from "./styles";
import { classes } from "./styles";

enum HomeEnum {
  TAG_LIST = "tagList",
  SOURCE_LIST = "sourceList",
  NEW_TAG = "newTag",
  NEW_SOURCE = "newSource",
  NEW_AUTHOR = "newAuthor"
}

interface HomeState {
  modalOpened: {};
}

type HomeProps = RouteComponentProps<{}>;

export class Home extends React.Component<HomeProps, HomeState> {
  state: HomeState = {
    modalOpened: {}
  };

  constructor(props: HomeProps) {
    super(props);
  }

  render() {
    return (
      <div className={`${classes.homeRoot}`}>
        <Header title="Home" />

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
              onClick={this.toggleModalOpen(HomeEnum.TAG_LIST, true)}
            >
              <Icon name="numbered list" />
              List Tags
            </Menu.Item>

            <Menu.Item
              style={styles.menuAnchor}
              onClick={this.toggleModalOpen(HomeEnum.SOURCE_LIST, true)}
            >
              <Icon name="numbered list" />
              List Sources
            </Menu.Item>

            <Menu.Item
              style={styles.menuAnchor}
              onClick={this.toggleModalOpen(HomeEnum.NEW_AUTHOR, true)}
            >
              <Icon name="user" />
              New Author
            </Menu.Item>

            <Menu.Item
              style={styles.menuAnchor}
              onClick={this.toggleModalOpen(HomeEnum.NEW_TAG, true)}
            >
              <Icon name="tag" />
              New Tag
            </Menu.Item>

            <Menu.Item
              style={styles.menuAnchor}
              onClick={this.toggleModalOpen(HomeEnum.NEW_SOURCE, true)}
            >
              <Icon name="user" />
              New Source
            </Menu.Item>
          </Menu>
        </div>

        {this.state.modalOpened[HomeEnum.TAG_LIST] && (
          <TagsModal
            open={this.state.modalOpened[HomeEnum.TAG_LIST]}
            dismissModal={this.toggleModalOpen(HomeEnum.TAG_LIST, false)}
          />
        )}

        {this.state.modalOpened[HomeEnum.SOURCE_LIST] && (
          <SourcesModal
            open={this.state.modalOpened[HomeEnum.SOURCE_LIST]}
            dismissModal={this.toggleModalOpen(HomeEnum.SOURCE_LIST, false)}
          />
        )}

        {this.state.modalOpened[HomeEnum.NEW_AUTHOR] && (
          <NewAuthorModal
            open={this.state.modalOpened[HomeEnum.NEW_AUTHOR]}
            dismissModal={this.toggleModalOpen(HomeEnum.NEW_AUTHOR, false)}
            style={{ marginTop: 0 }}
          />
        )}

        {this.state.modalOpened[HomeEnum.NEW_TAG] && (
          <NewTagModalForm
            open={this.state.modalOpened[HomeEnum.NEW_TAG]}
            dismissModal={this.toggleModalOpen(HomeEnum.NEW_TAG, false)}
            style={{ marginTop: 0 }}
          />
        )}

        {this.state.modalOpened[HomeEnum.NEW_SOURCE] && (
          <SourceModal
            open={this.state.modalOpened[HomeEnum.NEW_SOURCE]}
            dismissModal={this.toggleModalOpen(HomeEnum.NEW_SOURCE, false)}
            style={{ marginTop: 0 }}
          />
        )}
      </div>
    );
  }

  toggleModalOpen = (name: string, open: boolean) => () => {
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
