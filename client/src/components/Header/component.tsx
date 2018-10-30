import * as React from "react";
import { NavLink } from "react-router-dom";

import "./header.css";
import { Props } from "./header.utils";
import { LOGIN_URL, USER_REG_URL, PROJECTS_URL } from "../../routes/util";

const NO_DISPLAY_PROJECT_PATHS = [LOGIN_URL, USER_REG_URL, PROJECTS_URL];

export default class Header extends React.PureComponent<Props> {
  render() {
    const { className, style, currentProject, title } = this.props;

    return (
      <div className={`${className} app-header`} style={style} color="green">
        <div className="top">
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
  }

  private shouldDisplayProject = () => {
    const {
      currentProject,
      match: { path }
    } = this.props;
    return currentProject && !NO_DISPLAY_PROJECT_PATHS.includes(path);
  };
}
