import * as React from "react";
import Loadable from "react-loadable";
import { BrowserRouter } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

import { ROOT_URL, PROJECTS_URL } from "./../../routes/util";
import { TAG_URL } from "./../../routes/util";
import { SOURCE_URL } from "./../../routes/util";
import { NEW_QUOTE_URL } from "./../../routes/util";
import { SEARCH_QUOTES_URL } from "./../../routes/util";
import { QUOTE_URL } from "./../../routes/util";
import { AUTHOR_ROUTE_URL } from "./../../routes/util";
import { USER_REG_URL } from "./../../routes/util";
import { LOGIN_URL } from "./../../routes/util";
import Loading from "./../../components/Loading";
import AuthRequired from "./AuthRequired";

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

const ProjectsRoute = Loadable({
  loading: Loading,
  loader: () => import("./../../routes/Projects")
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
            path={PROJECTS_URL}
            component={ProjectsRoute}
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

          <Route component={LoginRoute} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
