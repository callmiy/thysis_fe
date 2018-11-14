import * as React from "react";
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
import { logger } from "src/utils";

// tslint:disable-next-line:no-any
const ReactLazy = React as any;
const Home = ReactLazy.lazy(() => import("./../../routes/Home"));
const TagDetail = ReactLazy.lazy(() => import("./../../routes/TagDetail"));
const Source = ReactLazy.lazy(() => import("./../../routes/Source"));
const NewQuote = ReactLazy.lazy(() => import("./../../routes/NewQuote"));
const Quote = ReactLazy.lazy(() => import("./../../routes/Quote"));
const AuthorRoute = ReactLazy.lazy(() => import("./../../routes/Author"));
const LoginRoute = ReactLazy.lazy(() => import("./../../routes/Login"));
const ProjectsRoute = ReactLazy.lazy(() => import("./../../routes/Projects"));

const SearchQuotes = ReactLazy.lazy(() =>
  import("./../../routes/SearchQuotes")
);

const UserRegRoute = ReactLazy.lazy(() =>
  import("./../../routes/Registration")
);

export class App extends React.Component<{}, State> {
  state: State = { showSidebar: false };

  async componentDidMount() {
    try {
      // See above for additional options, including other storage providers.
      await persistCache();
    } catch (error) {
      logger("error", "Error restoring Apollo cache", error);
    }

    this.setState({ cacheLoaded: true });
  }

  render() {
    const { cacheLoaded } = this.state;

    if (!cacheLoaded) {
      return <Loading />;
    }

    return (
      <ReactLazy.Suspense fallback={<Loading />}>
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

                <AuthRequired
                  exact={true}
                  path={SOURCE_URL}
                  component={Source}
                />

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

                <AuthRequired
                  exact={true}
                  path={TAG_URL}
                  component={TagDetail}
                />

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
      </ReactLazy.Suspense>
    );
  }

  private handleShowSidebar = () => {
    this.setState({ showSidebar: true });
  };

  private handleHideSidebar = () => {
    this.setState({ showSidebar: false });
  };
}

export default App;
