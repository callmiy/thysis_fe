import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import update from "immutability-helper";

import Header from "../../components/header.component";
import { makeNewQuoteURL } from "../../utils/route-urls.util";
import { SEARCH_QUOTES_URL } from "../../utils/route-urls.util";
import TagListModal from "../../components/tag-list-modal.component";
import SourceListModal from "../../components/source-list-modal.component";
import NewTagModalForm from "../../components/new-tag-modal-form.component";
import NewSourceModal from "../../components/new-source-modal.component";
import styles from "./styles";
import { classes } from "./styles";

enum HomeEnum {
  TAG_LIST = "tagList",
  SOURCE_LIST = "sourceList",
  NEW_TAG = "newTag",
  NEW_SOURCE = "newSource"
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