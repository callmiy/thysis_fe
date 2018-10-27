import * as React from "react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import "./quote-route.css";
import RootHeader from "../../components/Header";
import { setTitle } from "../../routes/util";
import { makeSourceURL } from "../../routes/util";
import { makeTagURL } from "../../routes/util";
import { Props } from "./utils";
import { State } from "./utils";
import { QuoteFull_quote_tags } from "../../graphql/gen.types";
import MobileBottomMenu from "../../components/mobile-bottom-menu.component";
import { MenuItem } from "../../components/mobile-bottom-menu.component";

export class Quote extends React.Component<Props, State> {
  componentDidMount() {
    setTitle("Quote");
  }

  componentWillUnmount() {
    setTitle();
  }

  render() {
    return (
      <div className="quote-route">
        <RootHeader title="Quote" />

        {this.renderMainOrLoading()}

        <MobileBottomMenu items={[MenuItem.HOME, MenuItem.SEARCH]} />
      </div>
    );
  }

  renderMainOrLoading = () => {
    const { loading, quote, error } = this.props;

    if (error) {
      return (
        <div className="{`${classes.sourceMain} ${classes.errorContainer}`}">
          {error.message}
        </div>
      );
    }

    if (loading || !quote) {
      return (
        <Dimmer
          inverted={true}
          className="{`${classes.sourceMain}`}"
          active={true}
        >
          <Loader size="medium">Loading..</Loader>
        </Dimmer>
      );
    }

    return (
      <div className="main">
        <div className="quote-text">{quote.text}</div>

        <hr />

        <div className="date">Date: {quote.date}</div>

        <div className="page-start">Page start: {quote.pageStart} </div>

        <div className="page-end">Page End: {quote.pageEnd} </div>

        <div className="volume">Volume: {quote.volume} </div>

        <div className="extras">Extras: {quote.extras} </div>

        <hr />

        {quote.source && (
          <NavLink to={makeSourceURL(quote.source.id)} className="quote-text">
            {quote.source.display}
          </NavLink>
        )}

        {quote.tags && (
          <div>
            <h4>Tags</h4>

            <List divided={true}>{quote.tags.map(this.renderTag)}</List>
          </div>
        )}
      </div>
    );
  };

  private renderTag = ({ id, text }: QuoteFull_quote_tags) => {
    return (
      <List.Item
        as={NavLink}
        to={makeTagURL(id)}
        key={id}
        className="quote-text"
      >
        <div>{text}</div>
      </List.Item>
    );
  };
}

export default Quote;
