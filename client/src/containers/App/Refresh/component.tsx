import React from "react";
import { Redirect } from "react-router-dom";
import { LOGIN_URL } from "./../../../routes/util";

import { Props } from "./utils";
import Loading from "../Loading";

export class Refresh extends React.Component<Props, {}> {
  render() {
    const { loading, refresh: user } = this.props;
    if (loading && !user) {
      return <Loading />;
    }

    const { component: Component, ...rest } = this.props.componentProps;

    if (user) {
      this.props.updateLocalUser({
        variables: { user }
      });

      return <Component {...rest} />;
    }

    return <Redirect to={LOGIN_URL} {...rest} />;
  }
}

export default Refresh;
