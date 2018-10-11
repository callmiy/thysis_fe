import jss from "jss";
import preset from "jss-preset-default";
import * as React from "react";
import Loadable from "react-loadable";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Dimmer, Loader } from "semantic-ui-react";

import { ROOT_CONTAINER_STYLE } from "./constants";
import { SimpleCss } from "./constants";
import { ROOT_URL } from "./routes/util";
import { TAG_URL } from "./routes/util";
import { SOURCE_URL } from "./routes/util";
import { NEW_QUOTE_URL } from "./routes/util";
import { SEARCH_QUOTES_URL } from "./routes/util";

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

export const Loading = () => (
  <Dimmer inverted={true} className={`${classes.app}`} active={true}>
    <Loader size="medium">Loading..</Loader>
  </Dimmer>
);

const Home = Loadable({
  loading: Loading,
  loader: () => import("./routes/Home")
});

const TagDetail = Loadable({
  loading: Loading,
  loader: () => import("./routes/TagDetail")
});

const Source = Loadable({
  loading: Loading,
  loader: () => import("./routes/Source")
});

const NewQuote = Loadable({
  loading: Loading,
  loader: () => import("./routes/NewQuote")
});

const SearchQuotes = Loadable({
  loading: Loading,
  loader: () => import("./routes/SearchQuotes")
});

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact={true} path={SOURCE_URL} component={Source} />
          <Route
            exact={true}
            path={SEARCH_QUOTES_URL}
            component={SearchQuotes}
          />
          <Route exact={true} path={TAG_URL} component={TagDetail} />
          <Route exact={true} path={NEW_QUOTE_URL} component={NewQuote} />
          <Route exact={true} path={ROOT_URL} component={Home} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
