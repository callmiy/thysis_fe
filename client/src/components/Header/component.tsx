import * as React from "react";
import { Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import "./header.css";
import { Props, State, INITIAL_STATE } from "./header.utils";
import {
  AppSidebarConsumer,
  SideBarContextProps
} from "../../containers/App/app.utils";
import { ROOT_URL } from "src/routes/util";

export default class Header extends React.Component<Props, State> {
  state = INITIAL_STATE;

  render() {
    return <AppSidebarConsumer>{this.renderWithContext}</AppSidebarConsumer>;
  }

  private renderWithContext = (context: SideBarContextProps) => {
    const {
      className = "",
      style,
      currentProject,
      title,
      match: { path },
      showSideBarTrigger
    } = this.props;

    return (
      <div className={`${className} app-header`} style={style} color="green">
        <div className="top">
          {showSideBarTrigger && (
            <a className="sidebar-trigger item" onClick={context.onShowClicked}>
              <Icon name="content" />
            </a>
          )}

          <div className="title">{title}</div>

          {currentProject && (
            <NavLink
              to={path === ROOT_URL ? "#" : ROOT_URL}
              className="project-title"
            >
              {currentProject.title}
            </NavLink>
          )}
        </div>
      </div>
    );
  };
}
