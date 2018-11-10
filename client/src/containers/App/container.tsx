import * as React from "react";
import Loadable from "react-loadable";
import { BrowserRouter } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";

import { client, persistCache } from "../../apollo-setup";
import {
  ROOT_URL,
  PROJECTS_URL,
  TAG_URL,
  SOURCE_URL,
  NEW_QUOTE_URL,
  SEARCH_QUOTES_URL,
  QUOTE_URL,
  AUTHOR_ROUTE_URL,
  USER_REG_URL,
  LOGIN_URL
} from "./../../routes/util";
import Loading from "./../../components/Loading";
import AuthRequired from "./AuthRequired";
import { AppSidebarContext, State } from "./app.utils";

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

export class App extends React.Component<{}, State> {
  state: State = { showSidebar: false };

  async componentDidMount() {
    try {
      // See above for additional options, including other storage providers.
      await persistCache();
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error("Error restoring Apollo cache", error);
    }

    this.setState({ cacheLoaded: true });
  }

  render() {
    const { cacheLoaded } = this.state;

    if (!cacheLoaded) {
      return <Loading />;
    }

    return (
      <ApolloProvider client={client}>
        <AppSidebarContext.Provider
          value={{
            showSidebar: this.state.showSidebar,
            onShowClicked: this.handleShowSidebar,
            onHide: this.handleHideSidebar
          }}
        >
          <BrowserRouter>
            <Switch>
              <Route
                exact={true}
                path={USER_REG_URL}
                component={UserRegRoute}
              />
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
        </AppSidebarContext.Provider>
      </ApolloProvider>
    );
  }

  private handleShowSidebar = () => {
    this.setState(s => ({ ...s, showSidebar: true }));
  };

  private handleHideSidebar = () => {
    this.setState(s => ({ ...s, showSidebar: false }));
  };
}

export default App;
