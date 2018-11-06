import * as React from "react";
import { Icon } from "semantic-ui-react";

import "./header.css";
import { Props, State, INITIAL_STATE } from "./header.utils";
import {
  AppSidebarContext,
  SideBarContextProps
} from "../../containers/App/app.utils";

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

          {currentProject && (
            <div className="project-title">currentProject.title</div>
          )}
        </div>
      </div>
    );
  };
}
