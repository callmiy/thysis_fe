import * as React from "react";
import { Sidebar, Segment, Menu, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import update from "immutability-helper";

import "./app-sidebar.css";
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
    const { onShowClicked, minWidth600, showSidebar } = context;

    let pushableClassName = "src-components-app-sidebar";

    if (minWidth600) {
      pushableClassName += " " + "pushable-min-width-600";
    }

    if (showSidebar) {
      pushableClassName += " " + "pushable-showing-sidebar";
    }

    const {
      match: { path },
      currentProject
    } = this.props;

    return (
      <Sidebar.Pushable as={Segment} className={pushableClassName}>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          onHide={this.hideSidebar}
          vertical={true}
          visible={context.showSidebar}
        >
          {minWidth600 && (
            <a className="sidebar-trigger-sidebar item" onClick={onShowClicked}>
              <Icon name="content" />
            </a>
          )}

          {currentProject && path !== ROOT_URL ? (
            <Menu.Item
              as={NavLink}
              to={makeNewQuoteURL()}
              onClick={this.hideSidebar}
              className="home-menu"
            >
              <Icon name="quote right" />
              <span>Home</span>
            </Menu.Item>
          ) : (
            undefined
          )}

          {path !== PROJECTS_URL ? (
            <Menu.Item
              as={NavLink}
              to={PROJECTS_URL}
              onClick={this.hideSidebar}
            >
              <Icon name="gem" />
              <span>Projects</span>
            </Menu.Item>
          ) : (
            undefined
          )}

          {currentProject && path !== SEARCH_QUOTES_URL ? (
            <Menu.Item
              as={NavLink}
              to={SEARCH_QUOTES_URL}
              onClick={this.hideSidebar}
            >
              <Icon name="search" />
              <span>Search</span>
            </Menu.Item>
          ) : (
            undefined
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(MenuItemNames.NEW_SOURCE, true)}
            >
              <Icon name="user" />
              <span>New Source</span>
            </Menu.Item>
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(MenuItemNames.NEW_AUTHOR, true)}
            >
              <Icon name="user" />
              <span>New Author</span>
            </Menu.Item>
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(MenuItemNames.NEW_TAG, true)}
            >
              <Icon name="tag" />
              <span>New Tag</span>
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
              <span>New Source Type</span>
            </Menu.Item>
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(MenuItemNames.TAG_LIST, true)}
            >
              <Icon name="numbered list" />
              <span>List Tags</span>
            </Menu.Item>
          )}

          {currentProject && (
            <Menu.Item
              onClick={this.toggleModalState(MenuItemNames.SOURCE_LIST, true)}
            >
              <Icon name="numbered list" />
              <span>List Sources</span>
            </Menu.Item>
          )}

          {!AUTH_URLS.includes(path) ? (
            <Menu.Item onClick={this.logout(this.hideSidebar)}>
              <Icon name="sign-out" />
              <span>Logout</span>
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
      this.hideSidebar();
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

  private hideSidebar = () => {
    const { minWidth600, onHide } = this.context;
    if (minWidth600) {
      return;
    }

    onHide();
  };
}

export default AppSideBar;
