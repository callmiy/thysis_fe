import * as React from "react";
import { Header, Dimmer, Loader, Menu, Icon, Message } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import update from "immutability-helper";
import { ApolloQueryResult } from "apollo-client";
import { NavLink } from "react-router-dom";

import RootHeader from "../../components/header.component";
import { makeNewQuoteURL } from "../../utils/route-urls.util";
import { Quotes1Query } from "../../graphql/gen.types";
import MobileBottomMenu from "../../components/mobile-bottom-menu.component";
import { MenuItem } from "../../components/mobile-bottom-menu.component";
import QUOTES_QUERY from "../../graphql/quotes-1.query";
import renderQuote from "../../components/quote-item.component";
import { SEARCH_QUOTES_URL } from "../../utils/route-urls.util";
import { setTitle } from "../../utils/route-urls.util";
import { styles } from "./styles";
import { classes } from "./styles";
import { SourceProps } from "./utils";
import { SourceState } from "./utils";

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
    const { loading, source } = this.props;

    if (loading || !source) {
      return (
        <Dimmer
          inverted={true}
          className={`${classes.SourceRoot}`}
          active={true}
        >
          <Loader size="medium">Loading..</Loader>
        </Dimmer>
      );
    }

    const { showingQuotes, loadingQuotes } = this.state;

    return (
      <div className={`${classes.SourceRoot}`}>
        <RootHeader title="Source" />

        <div className={`${classes.SourceRoot}`}>
          <Header style={styles.header} as="h3" dividing={true}>
            {source.display}
          </Header>

          <div className={`${classes.mainContent}`}>
            <Menu
              style={{
                ...(showingQuotes ? { opacity: 0 } : {}),
                ...styles.menu,
                ...{ margin: "5px" }
              }}
              pointing={true}
              compact={true}
              icon="labeled"
            >
              <Menu.Item
                className={classes.menuAnchor}
                onClick={this.newQuoteClicked}
              >
                <Icon name="quote right" />
                New Quote
              </Menu.Item>

              <Menu.Item
                className={classes.menuAnchor}
                onClick={this.quotesMenuClicked(source.id)}
              >
                <Icon name="numbered list" />
                List Quotes
              </Menu.Item>

              <Menu.Item
                className={classes.menuAnchor}
                as={NavLink}
                to={SEARCH_QUOTES_URL}
              >
                <Icon name="search" />
                Search Quotes
              </Menu.Item>
            </Menu>

            {loadingQuotes && (
              <Dimmer
                inverted={true}
                className={`${classes.SourceRoot}`}
                active={true}
              >
                <Loader inverted={true} size="medium">
                  Loading..
                </Loader>
              </Dimmer>
            )}

            {showingQuotes && (
              <div className={`${classes.quotesContainer}`}>
                <span
                  className={`${classes.quotesCloseButton}`}
                  onClick={this.quotesMenuCloseClicked}
                >
                  &times;
                </span>

                {this.renderQuoteOr()}
              </div>
            )}
          </div>
        </div>

        <MobileBottomMenu
          items={[
            MenuItem.HOME,
            MenuItem.NEW_SOURCE,
            MenuItem.TAG_LIST,
            MenuItem.NEW_TAG
          ]}
        />
      </div>
    );
  }

  quotesMenuClicked = (id: string) => async () => {
    try {
      this.setState(s =>
        update(s, {
          loadingQuotes: {
            $set: true
          },

          showingQuotes: {
            $set: true
          }
        })
      );

      const result = (await this.props.client.query({
        query: QUOTES_QUERY,
        variables: {
          quote: {
            source: id
          }
        }
      })) as ApolloQueryResult<Quotes1Query>;

      this.setState(s =>
        update(s, {
          quotes: {
            $set: result.data.quotes
          },

          loadingQuotes: {
            $set: false
          }
        })
      );
    } catch (error) {
      this.setState(s =>
        update(s, {
          loadingQuotes: {
            $set: false
          },

          fetchQuotesError: {
            $set: error
          }
        })
      );
    }
  };

  quotesMenuCloseClicked = () =>
    this.setState(s =>
      update(s, {
        loadingQuotes: {
          $set: false
        },

        showingQuotes: {
          $set: false
        }
      })
    );

  newQuoteClicked = () => {
    const source = this.props.source;

    if (source) {
      this.props.history.push(makeNewQuoteURL(source.id));
    }
  };

  renderQuoteOr = () => {
    const { fetchQuotesError } = this.state;

    if (fetchQuotesError) {
      return (
        <Message error={true}>
          <Message.Header>Error fetching quotes</Message.Header>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(fetchQuotesError, null, 2)}
          </pre>
        </Message>
      );
    }

    const { quotes } = this.state;

    if (!quotes || !quotes.length) {
      return (
        <Message info={true}>
          <Message.Header>No quote for source</Message.Header>
          <p>Click New Quote to add quote</p>
        </Message>
      );
    }

    return (
      <List style={styles.quotesList} divided={true} relaxed={true}>
        {quotes.map(renderQuote)}
      </List>
    );
  };
}

export default Source;
