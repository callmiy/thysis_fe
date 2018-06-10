import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { RouteComponentProps, NavLink } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";
import update from "immutability-helper";

import Header from "../components/header.component";
import { SimpleCss } from "../constants";
import { ROOT_CONTAINER_STYLE } from "../constants";
import { makeNewQuoteURL } from "../utils/route-urls.util";
import { SEARCH_QUOTES_URL } from "../utils/route-urls.util";
import centeredMenuStyles from "../utils/centered-menu-styles.util";
import TagListModal from "../components/tag-list-modal.component";
import SourceListModal from "../components/source-list-modal.component";
import NewTagModalForm from "../components/new-tag-modal-form.component";
import NewSourceModal from "../components/new-source-modal.component";

jss.setup(preset());

enum HomeEnum {
  TAG_LIST = "tagList",
  SOURCE_LIST = "sourceList",
  NEW_TAG = "newTag",
  NEW_SOURCE = "newSource"
}

const styles = {
  homeRoot: ROOT_CONTAINER_STYLE,

  homeMain: centeredMenuStyles.mainParentContainer,

  menu: {
    ...centeredMenuStyles.menu,
    flex: "1",
    margin: "10px",
    overflowY: "auto"
  },

  menuAnchor: {
    ...centeredMenuStyles.menuAnchor,
    minWidth: "130px"
  },

  quotesContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: "10px",
    overflowX: "hidden",
    overflowY: "auto",
    opacity: 1,
    margin: "10px",
    border: "1px solid #dcd6d6",
    borderRadius: "3px",
    boxShadow: "5px 5px 2px -2px #757575",
    maxHeight: "70vh"
  }
} as SimpleCss;

interface HomeState {
  modalOpened: {
    tagList: boolean;
  };
}

const initialModalOpened = {
  tagList: false
};

const { classes } = jss.createStyleSheet(styles).attach();

type HomeProps = RouteComponentProps<{}>;

export default class Home extends React.Component<HomeProps, HomeState> {
  state: HomeState = {
    modalOpened: initialModalOpened
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
          >
            <Menu.Item
              style={styles.menuAnchor}
              as={NavLink}
              to={SEARCH_QUOTES_URL}
            >
              <Icon name="search" />
              Search Quotes
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
          <TagListModal
            open={this.state.modalOpened[HomeEnum.TAG_LIST]}
            dismissModal={this.toggleModalOpen(HomeEnum.TAG_LIST, false)}
          />
        )}

        {this.state.modalOpened[HomeEnum.SOURCE_LIST] && (
          <SourceListModal
            open={this.state.modalOpened[HomeEnum.SOURCE_LIST]}
            dismissModal={this.toggleModalOpen(HomeEnum.SOURCE_LIST, false)}
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
          <NewSourceModal
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
