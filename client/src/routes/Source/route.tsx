import React from "react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import RootHeader from "../../components/Header";
import { setTitle } from "../../routes/util";
import { makeNewQuoteURL } from "../../routes/util";
import { classes } from "./styles";
import { SourceProps } from "./utils";
import { SourceState } from "./utils";
import SourceAccordion from "./SourceAccordion";
import AppSideBar from "src/components/AppSidebar";

export class Source extends React.Component<SourceProps, SourceState> {
  state: SourceState = {
    loadingQuotes: false,
    showingQuotes: false
  };

  componentDidMount() {
    setTitle("Source");
  }

  componentWillUnmount() {
    setTitle();
  }

  render() {
    return (
      <AppSideBar>
        <div className={`${classes.SourceRoot}`}>
          <RootHeader
            title="Source"
            className={classes.RootHeader}
            showSideBarTrigger={true}
          />

          {this.renderMainOrLoading()}
        </div>
      </AppSideBar>
    );
  }

  renderMainOrLoading = () => {
    const { loading, source, error } = this.props;

    if (error) {
      return (
        <div className={`${classes.sourceMain} ${classes.errorContainer}`}>
          {error.message}
        </div>
      );
    }

    if (loading || !source) {
      return (
        <Dimmer
          inverted={true}
          className={`${classes.sourceMain}`}
          active={true}
        >
          <Loader size="medium">Loading..</Loader>
        </Dimmer>
      );
    }

    return (
      <div className={`${classes.sourceMain}`}>
        <NavLink
          to={makeNewQuoteURL(source.id)}
          className={classes.newQuoteButton}
        >
          <Icon name="add circle" circular={true} />
          <span style={{ fontWeight: 100, fontSize: "0.65em" }}>New Quote</span>
        </NavLink>

        <SourceAccordion source={source} />
      </div>
    );
  };
}

export default Source;
