import * as React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "semantic-ui-react";

import "./header.css";
import { Props, State, INITIAL_STATE } from "./header.utils";
import { LOGIN_URL, USER_REG_URL, PROJECTS_URL } from "../../routes/util";
import {
  AppSidebarContext,
  SideBarContextProps
} from "../../containers/App/app.utils";

const NO_DISPLAY_PROJECT_PATHS = [LOGIN_URL, USER_REG_URL, PROJECTS_URL];

export default class Header extends React.Component<Props, State> {
  state = INITIAL_STATE;

  render() {
    return (
      <AppSidebarContext.Consumer>
        {this.renderWithContext}
      </AppSidebarContext.Consumer>
    );
  }

  private renderWithContext = (context: SideBarContextProps) => {
    const { className = "", style, currentProject, title } = this.props;

    return (
      <div className={`${className} app-header`} style={style} color="green">
        <div className="top">
          <a className="sidebar-trigger item" onClick={context.onShowClicked}>
            <Icon name="content" />
          </a>
          <div className="title">{title}</div>
        </div>

        <div className="bottom">
          {this.shouldDisplayProject() && (
            <div>
              <NavLink to={PROJECTS_URL} className="to-projects">
                Projects
              </NavLink>

              <div className="project-title">
                {currentProject && currentProject.title}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  private shouldDisplayProject = () => {
    const {
      currentProject,
      match: { path }
    } = this.props;
    return currentProject && !NO_DISPLAY_PROJECT_PATHS.includes(path);
  };
}
