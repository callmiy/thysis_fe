import React from "react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { Menu } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import RootHeader from "../../components/header.component";
import { SEARCH_QUOTES_URL } from "../../utils/route-urls.util";
import { setTitle } from "../../utils/route-urls.util";
import { styles } from "./styles";
import { classes } from "./styles";
import { SourceProps } from "./utils";
import { SourceState } from "./utils";
import SourceMenu from "./bottom-menu.component";
import SourceAccordion from "./SourceAccordion";
// import { ExistingSourceProps } from "../../components/SourceModal/utils";
// import SourceModal from "../../components/SourceModal";

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
      <div className={`${classes.SourceRoot}`}>
        <RootHeader title="Source" className={classes.RootHeader} />

        {this.renderMainOrLoading()}

        <div className={classes.bottomMenu}>
          <SourceMenu />
        </div>
      </div>
    );
  }

  renderMainOrLoading = () => {
    const { loading, source } = this.props;

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

    const { showingQuotes } = this.state;

    return (
      <div className={`${classes.sourceMain}`}>
        <SourceAccordion source={source} />

        <Menu
          style={{
            ...(showingQuotes ? { opacity: 0 } : {}),
            ...styles.menu,
            ...{ margin: "5px", display: "none" }
          }}
          pointing={true}
          compact={true}
          icon="labeled"
        >
          <Menu.Item
            className={classes.menuAnchor}
            as={NavLink}
            to={SEARCH_QUOTES_URL}
          >
            <Icon name="search" />
            Search Quotes
          </Menu.Item>
        </Menu>
      </div>
    );
  };
}

export default Source;
