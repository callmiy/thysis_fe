import jss from "jss";
import preset from "jss-preset-default";
import * as React from "react";
import Loadable from "react-loadable";
import { BrowserRouter } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { RouteProps } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";
import { graphql } from "react-apollo";

import { ROOT_CONTAINER_STYLE } from "./../../constants";
import { SimpleCss } from "./../../constants";
import { ROOT_URL } from "./../../routes/util";
import { TAG_URL } from "./../../routes/util";
import { SOURCE_URL } from "./../../routes/util";
import { NEW_QUOTE_URL } from "./../../routes/util";
import { SEARCH_QUOTES_URL } from "./../../routes/util";
import { QUOTE_URL } from "./../../routes/util";
import { AUTHOR_ROUTE_URL } from "./../../routes/util";
import { USER_REG_URL } from "./../../routes/util";
import { LOGIN_URL } from "./../../routes/util";
import USER_FROM_LOCAL_QUERY from "./../../state/user-from-local-storage.query";
import { UserFromLocalState } from "./utils";
import { AuthOwnProps } from "./utils";
import { AuthProps } from "./utils";

jss.setup(preset());

const styles = {
  app: ROOT_CONTAINER_STYLE,

  loadingIndicator: {
    display: "flex",
    flex: 1,
    "justify-content": "center",
    "align-items": "center",
    background: "#757575",
    color: "#fff",
    "font-size": "1.5rem",
    height: "100%"
  }
} as SimpleCss;

const { classes } = jss.createStyleSheet(styles).attach();

const userFromLocalGraphQl = graphql<
  AuthOwnProps,
  UserFromLocalState,
  {},
  {}
  // UserFromLocalState
>(USER_FROM_LOCAL_QUERY, {
  props: props => {
    return props;
  }
});

export const AuthRequired = userFromLocalGraphQl(
  ({ component: AuthComponent, ...rest }: AuthProps) => {
    const render = (childProps: RouteProps) => {
      if (rest.data && rest.data.user && rest.data.user.jwt) {
        return <AuthComponent {...childProps} />;
      }

      return <Redirect to={LOGIN_URL} {...childProps} />;
    };

    return <Route {...rest} render={render} />;
  }
);

export const Loading = () => (
  <Dimmer inverted={true} className={`${classes.app}`} active={true}>
    <Loader size="medium">Loading..</Loader>
  </Dimmer>
);

const Home = Loadable({
  loading: Loading,
  loader: () => import("./../../routes/Home")
});

const TagDetail = Loadable({
  loading: Loading,
  loader: () => import("./../../routes/TagDetail")
});

const Source = Loadable({
  loading: Loading,
  loader: () => import("./../../routes/Source")
});

const NewQuote = Loadable({
  loading: Loading,
  loader: () => import("./../../routes/NewQuote")
});

const SearchQuotes = Loadable({
  loading: Loading,
  loader: () => import("./../../routes/SearchQuotes")
});

const Quote = Loadable({
  loading: Loading,
  loader: () => import("./../../routes/Quote")
});

const AuthorRoute = Loadable({
  loading: Loading,
  loader: () => import("./../../routes/Author")
});

const UserRegRoute = Loadable({
  loading: Loading,
  loader: () => import("./../../routes/Registration")
});

const LoginRoute = Loadable({
  loading: Loading,
  loader: () => import("./../../routes/Login")
});

export class App extends React.Component<{}> {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact={true} path={USER_REG_URL} component={UserRegRoute} />
          <Route exact={true} path={LOGIN_URL} component={LoginRoute} />
          <AuthRequired exact={true} path={SOURCE_URL} component={Source} />
          <AuthRequired exact={true} path={QUOTE_URL} component={Quote} />

          <AuthRequired
            exact={true}
            path={AUTHOR_ROUTE_URL}
            component={AuthorRoute}
          />

          <AuthRequired
            exact={true}
            path={SEARCH_QUOTES_URL}
            component={SearchQuotes}
          />

          <AuthRequired exact={true} path={TAG_URL} component={TagDetail} />

          <AuthRequired
            exact={true}
            path={NEW_QUOTE_URL}
            component={NewQuote}
          />

          <AuthRequired exact={true} path={ROOT_URL} component={Home} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
