import * as React from "react";
import { Redirect } from "react-router-dom";
import { RouteProps } from "react-router-dom";
import { Route } from "react-router-dom";

import Refresh from "./../Refresh";
import { Props } from "./utils";
import { LOGIN_URL } from "./../../../routes/util";

export const AuthRequired = ({
  component: AuthComponent,
  user,
  staleToken,
  ...rest
}: Props) => {
  const render = (childProps: RouteProps) => {
    if (user) {
      return <AuthComponent {...childProps} />;
    }

    if (staleToken) {
      return (
        <Refresh
          componentProps={{ component: AuthComponent, ...childProps }}
          jwt={staleToken}
        />
      );
    }

    return <Redirect to={LOGIN_URL} {...childProps} />;
  };

  return <Route user={user} {...rest} render={render} />;
};

export default AuthRequired;
