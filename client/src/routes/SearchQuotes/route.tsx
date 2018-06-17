import * as React from "react";

import RootHeader from "../../components/header.component";
import SearchQuotesMenu from "../../components/search-quotes-route-bottom-menu.component";
import { setTitle } from "../../utils/route-urls.util";
import { classes } from "./styles";
import SearchQuotesComponent from "../../components/SearchQuotesComponent";

export class SearchQuotes extends React.Component {
  componentDidMount() {
    setTitle("Search all");
  }

  componentWillUnmount() {
    setTitle();
  }

  render() {
    return (
      <div className={classes.root}>
        <RootHeader title="Search Quotes" />

        <SearchQuotesComponent />

        <SearchQuotesMenu />
      </div>
    );
  }
}

export default SearchQuotes;
