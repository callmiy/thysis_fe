import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { RouteComponentProps, NavLink } from "react-router-dom";
import { Menu, Icon } from "semantic-ui-react";
import update from "immutability-helper";

import Header from "../components/header.component";
import { SimpleCss, ROOT_CONTAINER_STYLE, makeNewQuoteURL } from "../constants";
import centeredMenuStyles from "../utils/centered-menu-styles.util";
import TagListModal from "../components/tag-list-modal.component";
import SourceListModal from "../components/source-list-modal.component";

jss.setup(preset());

enum HomeEnum {
  TAG_LIST = "tagList",
  SOURCE_LIST = "sourceList"
}

const styles = {
  homeRoot: ROOT_CONTAINER_STYLE,

  homeMain: {
    ...centeredMenuStyles.mainParentContainer,
    display: "flex",
    flexDirection: "column"
  },

  menu: {
    ...centeredMenuStyles.menu,
    margin: "10px"
  },

  menuAnchor: {
    ...centeredMenuStyles.menuAnchor
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
    // tslint:disable-next-line:no-any
    const ASourceListModal = SourceListModal as any;

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
              className={classes.menuAnchor}
              as={NavLink}
              to={makeNewQuoteURL()}
            >
              <Icon name="quote right" />
              New Quote
            </Menu.Item>

            <Menu.Item
              className={classes.menuAnchor}
              onClick={this.toggleModalOpen(HomeEnum.TAG_LIST, true)}
            >
              <Icon name="numbered list" />
              List Tags
            </Menu.Item>

            <Menu.Item
              className={classes.menuAnchor}
              onClick={this.toggleModalOpen(HomeEnum.SOURCE_LIST, true)}
            >
              <Icon name="numbered list" />
              List Sources
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
          <ASourceListModal
            open={this.state.modalOpened[HomeEnum.SOURCE_LIST]}
            dismissModal={this.toggleModalOpen(HomeEnum.SOURCE_LIST, false)}
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
