import * as React from "react";
import { Sidebar, Segment, Menu, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import { Props } from "./app-sidebar.utils";
import { AppSidebarContext, SideBarContextProps } from "../app.utils";
import {
  ROOT_URL,
  PROJECTS_URL,
  SEARCH_QUOTES_URL,
  makeNewQuoteURL
} from "../../../routes/util";

export class AppSideBar extends React.Component<Props> {
  render() {
    return (
      <AppSidebarContext.Consumer>
        {this.renderSideBar}
      </AppSidebarContext.Consumer>
    );
  }

  private renderSideBar = (context: SideBarContextProps) => {
    const {
      match: { path }
    } = this.props;

    const newQuoteUrl = makeNewQuoteURL();

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
          {path !== ROOT_URL ? (
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

          {path !== SEARCH_QUOTES_URL ? (
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

          {path !== newQuoteUrl ? (
            <Menu.Item as={NavLink} to={newQuoteUrl} onClick={context.onHide}>
              <Icon name="quote right" />
              New Quote
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
}

export default AppSideBar;
