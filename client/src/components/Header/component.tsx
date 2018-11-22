import * as React from "react";
import { Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import "./header.scss";
import { Props, State, INITIAL_STATE } from "./header.utils";
import {
  AppSidebarConsumer,
  SideBarContextProps
} from "../../containers/App/app.utils";
import { ROOT_URL, makeNewQuoteURL } from "../../routes/util";

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

    const { onShowClicked, minWidth600, showSidebar } = context;
    const show = minWidth600 ? !showSidebar : true;

    return (
      <div className={`${className} src-components-header`} style={style}>
        <div className="top">
          {showSideBarTrigger && show && (
            <a className="sidebar-trigger item" onClick={onShowClicked}>
              <Icon name="content" />
            </a>
          )}

          <div className="title">{title}</div>
        </div>

        {currentProject && (
          <div className="bottom">
            {path === ROOT_URL ? (
              <span className="project-title">{currentProject.title}</span>
            ) : (
              <NavLink to={makeNewQuoteURL()} className="project-title">
                {currentProject.title}
              </NavLink>
            )}
          </div>
        )}
      </div>
    );
  };
}
