import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import update from "immutability-helper";

import { client, persistCache } from "../../apollo-setup";
import {
  ROOT_URL,
  PROJECTS_URL,
  TAG_URL,
  SOURCE_URL,
  SEARCH_QUOTES_URL,
  QUOTE_URL,
  AUTHOR_ROUTE_URL,
  USER_REG_URL,
  LOGIN_URL
} from "./../../routes/util";
import Loading from "./../../components/Loading";
import AuthRequired from "./AuthRequired";
import {
  AppSidebarContext,
  State,
  initialState,
  mediaQueries,
  MediaQueryKey
} from "./app.utils";
import { logger } from "src/utils";

// tslint:disable-next-line:no-any
const ReactLazy = React as any;
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
  state: State = initialState;
  mediaListeners: Array<() => void> = [];

  async componentDidMount() {
    try {
      await persistCache();
    } catch (error) {
      logger("error", "Error restoring Apollo cache", error);
    }

    this.setState({ cacheLoaded: true });
    this.setUpMediaListeners();
  }

  componentWillUnmount() {
    this.tearDownMediaListeners();
  }

  render() {
    const { cacheLoaded } = this.state;

    if (!cacheLoaded) {
      return <Loading />;
    }

    const { showSidebar, mediaQueries: mQueries } = this.state;

    return (
      <ReactLazy.Suspense fallback={<Loading />}>
        <ApolloProvider client={client}>
          <AppSidebarContext.Provider
            value={{
              showSidebar,
              onShowClicked: this.toggleSidebar,
              onHide: this.toggleSidebar,
              minWidth600: mQueries[MediaQueryKey.SCREEN_MIN_WIDTH_600]
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
                  path={ROOT_URL}
                  component={NewQuote}
                />

                <Route component={LoginRoute} />
              </Switch>
            </BrowserRouter>
          </AppSidebarContext.Provider>
        </ApolloProvider>
      </ReactLazy.Suspense>
    );
  }

  private toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  };

  private tearDownMediaListeners = () => this.mediaListeners.forEach(m => m());

  private setUpMediaListeners = () => {
    const queries = Object.values(mediaQueries);
    // tslint:disable-next-line:no-any
    const handleMediaQueryChange = this.handleMediaQueryChange as any;

    for (let index = 0; index < queries.length; index++) {
      const m = window.matchMedia(queries[index]) as MediaQueryList;
      m.addListener(handleMediaQueryChange);
      handleMediaQueryChange(m);
      this.mediaListeners[index] = () =>
        m.removeListener(handleMediaQueryChange);
    }
  };

  private handleMediaQueryChange = (
    mql: MediaQueryListEvent | MediaQueryList
  ) => {
    const { matches, media } = mql;
    const acc1 = {} as { [k in MediaQueryKey]: { $set: boolean } };

    const updates = Object.entries(mediaQueries).reduce((acc2, [k, v]) => {
      const isMatchedMedia = v === media;

      if (isMatchedMedia && k === MediaQueryKey.SCREEN_MIN_WIDTH_600) {
        this.setState({ showSidebar: matches });
      }

      acc2[k] = { $set: isMatchedMedia ? matches : false };
      return acc2;
    }, acc1);

    this.setState(s =>
      update(s, {
        mediaQueries: updates
      })
    );
  };
}

export default App;
