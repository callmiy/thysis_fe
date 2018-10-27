import React from "react";
import { Redirect } from "react-router-dom";
import { LOGIN_URL } from "./../../../routes/util";
import { ROOT_URL } from "./../../../routes/util";

import { Props } from "./utils";
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
        (rest.location && rest.location.pathname) !== ROOT_URL
      ) {
        return <Redirect to={ROOT_URL} {...rest} />;
      }

      return <Component {...rest} />;
    }

    return <Redirect to={LOGIN_URL} {...rest} />;
  }
}

export default Refresh;
