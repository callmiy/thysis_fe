import * as React from "react";
import { Redirect } from "react-router-dom";
import { RouteProps } from "react-router-dom";
import { Route } from "react-router-dom";

import Refresh from "./../Refresh";
import { Props } from "./utils";
import { LOGIN_URL } from "./../../../routes/util";
import { ROOT_URL } from "../../../routes/util";

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
      if (!currentProject && rest.path !== ROOT_URL) {
        return <Redirect to={ROOT_URL} {...data} {...childProps} />;
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

    return <Redirect to={LOGIN_URL} {...childProps} />;
  };

  return <Route {...data} render={render} />;
};

export default AuthRequired;
