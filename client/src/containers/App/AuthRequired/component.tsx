import * as React from "react";
import { Redirect } from "react-router-dom";
import { RouteProps } from "react-router-dom";
import { Route } from "react-router-dom";

import Refresh from "./../Refresh";
import { Props } from "./auth-required";
import { LOGIN_URL, PROJECTS_URL } from "./../../../routes/util";

export const AuthRequired = ({
  component: AuthComponent,
  user,
  staleToken,
  currentProject,
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

      return <AuthComponent {...data} {...childProps} />;
    }

    if (staleToken) {
      return (
        <Refresh
          componentProps={{ component: AuthComponent, ...childProps }}
          jwt={staleToken}
          currentProject={currentProject}
        />
      );
    }

    return <Redirect to={LOGIN_URL} />;
  };

  return <Route {...data} render={render} />;
};

export default AuthRequired;
