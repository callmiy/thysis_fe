import * as React from "react";

import RootHeader from "../../components/Header";
import { setTitle } from "../../routes/util";
import { classes } from "./styles";
import SearchQuotesComponent from "../../components/SearchComponent";
import AppSideBar from "../../components/AppSidebar";

export class SearchQuotes extends React.Component {
  componentDidMount() {
    setTitle("Search all");
  }

  componentWillUnmount() {
    setTitle();
  }

  render() {
    return (
      <AppSideBar>
        <div className={classes.root}>
          <RootHeader title="Search" showSideBarTrigger={true} />

          <SearchQuotesComponent />
        </div>
      </AppSideBar>
    );
  }
}

export default SearchQuotes;
