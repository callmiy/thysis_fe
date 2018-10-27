import React from "react";
import { Redirect } from "react-router-dom";
import { LOGIN_URL, PROJECTS_URL } from "./../../../routes/util";

import { Props } from "./refresh";
import Loading from "../../../components/Loading";

export class Refresh extends React.Component<Props, {}> {
  render() {
    const { loading, refresh: user, currentProject } = this.props;
    if (loading && !user) {
      return <Loading />;
    }

    const { component: Component, ...rest } = this.props.componentProps;

    if (user) {
      this.props.updateLocalUser({
        variables: { user }
      });

      if (
        !currentProject &&
        (rest.location && rest.location.pathname) !== PROJECTS_URL
      ) {
        return <Redirect to={PROJECTS_URL} {...rest} />;
      }

      return <Component {...rest} />;
    }

    return <Redirect to={LOGIN_URL} {...rest} />;
  }
}

export default Refresh;
