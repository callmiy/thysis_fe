import * as React from "react";
import { Redirect } from "react-router-dom";
import { RouteProps } from "react-router-dom";
import { Route } from "react-router-dom";

import Refresh from "./../Refresh";
import { Props } from "./auth-required";
import { LOGIN_URL, PROJECTS_URL } from "./../../../routes/util";
import AppSideBar from "../AppSidebar";

export const AuthRequired = ({
  component: AuthComponent,
  user,
  staleToken,
  currentProject,
  updateLocalUser,
  ...rest
}: Props) => {
  const data = {
    user,
    currentProject,
    ...rest
  };

  const render = (childProps: RouteProps) => {
    if (user) {
      if (!currentProject && rest.path !== PROJECTS_URL) {
        return <Redirect to={PROJECTS_URL} />;
      }

      return (
        <AppSideBar>
          <AuthComponent {...data} {...childProps} />
        </AppSideBar>
      );
    }

    if (staleToken) {
      return (
        <AppSideBar>
          <Refresh
            componentProps={{ component: AuthComponent, ...childProps }}
            jwt={staleToken}
            currentProject={currentProject}
          />
        </AppSideBar>
      );
    }

    updateLocalUser({
      variables: {
        user: null
      }
    });

    return <Redirect to={LOGIN_URL} />;
  };

  return <Route {...data} render={render} />;
};

export default AuthRequired;
