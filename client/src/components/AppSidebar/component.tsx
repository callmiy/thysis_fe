import * as React from "react";
import { Sidebar, Segment, Menu, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import { Props } from "./app-sidebar";
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

const AUTH_URLS = [LOGIN_URL, USER_REG_URL];

export class AppSideBar extends React.Component<Props> {
  render() {
    return <AppSidebarConsumer>{this.renderSideBar}</AppSidebarConsumer>;
  }

  private renderSideBar = (context: SideBarContextProps) => {
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
      </Sidebar.Pushable>
    );
  };

  private logout = (onHide: () => void) => async () => {
    onHide();

    const { history, updateLocalUser } = this.props;

    await updateLocalUser({
      variables: {
        user: null
      }
    });

    history.replace(LOGIN_URL);
  };
}

export default AppSideBar;
