import jss from "jss";
import preset from "jss-preset-default";
import * as React from "react";
import Loadable from "react-loadable";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import {
  ROOT_URL,
  SimpleCss,
  ROOT_CONTAINER_STYLE,
  TAG_URL,
  SOURCE_URL,
  NEW_QUOTE_URL
} from "./constants";

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
  <div className={`${classes.loadingIndicator} ${classes.app}`}>
    <div>Loading...</div>
  </div>
);

const Home = Loadable({
  loading: Loading,
  loader: () => import("./routes/home.route")
});

const TagDetail = Loadable({
  loading: Loading,
  loader: () => import("./routes/tag-detail.route")
});

const Source = Loadable({
  loading: Loading,
  loader: () => import("./routes/source.route")
});

const NewQuote = Loadable({
  loading: Loading,
  loader: () => import("./routes/new-quote.route")
});

// tslint:disable-next-line:max-classes-per-file
class App extends React.Component {
  render() {
    return (
      <div className={`${classes.app}`}>
        <BrowserRouter>
          <Switch>
            <Route exact={true} path={SOURCE_URL} component={Source} />
            <Route exact={true} path={TAG_URL} component={TagDetail} />
            <Route exact={true} path={NEW_QUOTE_URL} component={NewQuote} />
            <Route exact={true} path={ROOT_URL} component={Home} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
