import * as React from "react";

import RootHeader from "../../components/Header";
import { setTitle } from "../../routes/util";
import { classes } from "./styles";
import SearchQuotesComponent from "../../components/SearchComponent";

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
      </div>
    );
  }
}

export default SearchQuotes;
