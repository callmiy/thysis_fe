import * as React from "react";
import { Sidebar, Segment, Menu, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import update from "immutability-helper";

import { Props, State, initialState } from "./app-sidebar";
import {
  AppSidebarConsumer,
  SideBarContextProps
} from "src/containers/App/app.utils";
import {
  ROOT_URL,
  PROJECTS_URL,
  SEARCH_QUOTES_URL,
  makeNewQuoteURL,
  NEW_QUOTE_URL,
  LOGIN_URL,
  USER_REG_URL
} from "src/routes/util";
import { MenuItemNames } from "src/constants";
import NewTagModalForm from "src/components/NewTagModalForm";
import SourceModal from "src/components/SourceModal";
import TagsModal from "src/components/TagsModal";
import SourcesModal from "src/components/SourcesModal";
import NewAuthorModal from "../NewAuthorModal";
import NewSourceTypeModal from "../NewSourceTypeModal";

const AUTH_URLS = [LOGIN_URL, USER_REG_URL];

export class AppSideBar extends React.Component<Props, State> {
  state: State = initialState;
  context: SideBarContextProps;

  render() {
    return <AppSidebarConsumer>{this.renderSideBar}</AppSidebarConsumer>;
  }

  private renderSideBar = (context: SideBarContextProps) => {
    this.context = context;

    const {
      match: { path },
      currentProject
    } = this.props;

    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          onHide={context.onHide}
          vertical={true}
          visible={context.showSidebar}
          width="thin"
        >
          {currentProject && path !== ROOT_URL ? (
            <Menu.Item as={NavLink} to={ROOT_URL} onClick={context.onHide}>
              <Icon name="home" />
              Home
            </Menu.Item>
          ) : (
            undefined
          )}

          {path !== PROJECTS_URL ? (
            <Menu.Item as={NavLink} to={PROJECTS_URL} onClick={context.onHide}>
              <Icon name="gem" />
              Projects
            </Menu.Item>
          ) : (
            undefined
          )}

          {currentProject && path !== SEARCH_QUOTES_URL ? (
            <Menu.Item
              as={NavLink}
              to={SEARCH_QUOTES_URL}
              onClick={context.onHide}
            >
              <Icon name="search" />
              Search
            </Menu.Item>
          ) : (
            undefined
          )}

          {currentProject && path !== NEW_QUOTE_URL ? (
            <Menu.Item
              as={NavLink}
              to={makeNewQuoteURL()}
              onClick={context.onHide}
            >
              <Icon name="quote right" />
              New Quote
            </Menu.Item>
          ) : (
            undefined
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(MenuItemNames.NEW_SOURCE, true)}
            >
              <Icon name="user" />
              New Source
            </Menu.Item>
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(MenuItemNames.NEW_AUTHOR, true)}
            >
              <Icon name="user" />
              New Author
            </Menu.Item>
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(MenuItemNames.NEW_TAG, true)}
            >
              <Icon name="tag" />
              New Tag
            </Menu.Item>
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(
                MenuItemNames.NEW_SOURCE_TYPE,
                true
              )}
            >
              <Icon name="tree" />
              New Source Type
            </Menu.Item>
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(MenuItemNames.TAG_LIST, true)}
            >
              <Icon name="numbered list" />
              List Tags
            </Menu.Item>
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(MenuItemNames.SOURCE_LIST, true)}
            >
              <Icon name="numbered list" />
              List Sources
            </Menu.Item>
          )}

          {!AUTH_URLS.includes(path) ? (
            <Menu.Item onClick={this.logout(context.onHide)}>
              <Icon name="sign-out" />
              Logout
            </Menu.Item>
          ) : (
            undefined
          )}
        </Sidebar>

        <Sidebar.Pusher style={{ height: "100%" }}>
          {this.props.children}
        </Sidebar.Pusher>

        {this.state.modalState[MenuItemNames.NEW_TAG] && (
          <NewTagModalForm
            open={this.state.modalState[MenuItemNames.NEW_TAG]}
            dismissModal={this.toggleModalState(MenuItemNames.NEW_TAG, false)}
            style={{ marginTop: 0 }}
            onTagCreated={this.props.onTagCreated}
          />
        )}

        {this.state.modalState[MenuItemNames.NEW_SOURCE] && (
          <SourceModal
            open={this.state.modalState[MenuItemNames.NEW_SOURCE]}
            dismissModal={this.toggleModalState(
              MenuItemNames.NEW_SOURCE,
              false
            )}
            style={{ marginTop: 0 }}
          />
        )}

        {this.state.modalState[MenuItemNames.NEW_SOURCE_TYPE] && (
          <NewSourceTypeModal
            open={this.state.modalState[MenuItemNames.NEW_SOURCE_TYPE]}
            dismissModal={this.toggleModalState(
              MenuItemNames.NEW_SOURCE_TYPE,
              false
            )}
            style={{ marginTop: 0 }}
          />
        )}

        {this.state.modalState[MenuItemNames.SOURCE_LIST] && (
          <SourcesModal
            open={this.state.modalState[MenuItemNames.SOURCE_LIST]}
            dismissModal={this.toggleModalState(
              MenuItemNames.SOURCE_LIST,
              false
            )}
          />
        )}

        {this.state.modalState[MenuItemNames.TAG_LIST] && (
          <TagsModal
            open={this.state.modalState[MenuItemNames.TAG_LIST]}
            dismissModal={this.toggleModalState(MenuItemNames.TAG_LIST, false)}
          />
        )}

        {this.state.modalState[MenuItemNames.NEW_AUTHOR] && (
          <NewAuthorModal
            open={this.state.modalState[MenuItemNames.NEW_AUTHOR]}
            modal={true}
            dismissModal={this.toggleModalState(
              MenuItemNames.NEW_AUTHOR,
              false
            )}
          />
        )}
      </Sidebar.Pushable>
    );
  };

  private logout = (onHide: () => void) => () => {
    onHide();

    const { history } = this.props;

    history.replace(LOGIN_URL);
  };

  private toggleModalState = (name: string, open: boolean) => () => {
    if (open && this.context) {
      this.context.onHide();
    }

    this.setState(s =>
      update(s, {
        modalState: {
          $set: initialState.modalState
        }
      })
    );

    this.setState(s =>
      update(s, {
        modalState: {
          [name]: {
            $set: open
          }
        }
      })
    );
  };
}

export default AppSideBar;
