import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { RouteComponentProps } from "react-router-dom";
import { Header, Dimmer, Loader, List, Menu, Icon } from "semantic-ui-react";
import { GraphqlQueryControls, graphql } from "react-apollo";

import RootHeader from "../components/header.component";
import { ROOT_CONTAINER_STYLE, SimpleCss, makeNewQuoteURL } from "../constants";
import { Source1Query, Source1QueryVariables } from "../graphql/gen.types";
import SOURCE_QUERY from "../graphql/source-1.query";
import MobileBottomMenu, {
  MenuItem
} from "../components/mobile-bottom-menu.component";
import QUOTES_QUERY from "../graphql/quotes-1.query";
import { Quotes1QueryComponent } from "../graphql/ops.types";
import renderQuote from "../components/quote-item.component";

jss.setup(preset());

const styles = {
  SourceRoot: ROOT_CONTAINER_STYLE,

  SourceMain: {
    flex: 1,
    overflowX: "hidden",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "0 5px 15px 10px"
  },

  mainContent: {
    position: "relative"
  },

  quotesContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: "10px",
    overflowX: "hidden",
    overflowY: "auto",
    opacity: 1,
    margin: "10px",
    border: "1px solid #dcd6d6",
    borderRadius: "3px",
    boxShadow: "5px 5px 2px -2px #757575"
  },

  quotesCloseButton: {
    position: "absolute",
    right: "-3px",
    top: "-7px",
    fontSize: "2em",
    fontWeight: 900,
    padding: "10px 10px 10px 30px",
    cursor: "pointer"
  }
} as SimpleCss;

const { classes } = jss.createStyleSheet(styles).attach();

type OwnProps = RouteComponentProps<{ id: string }> & Source1Query;

type SourceProps = OwnProps & GraphqlQueryControls<Source1QueryVariables>;

interface SourceState {
  showingQuotes: boolean;
}

class Source extends React.Component<SourceProps, SourceState> {
  state: SourceState = {
    showingQuotes: false
  };

  constructor(props: SourceProps) {
    super(props);

    ["quotesMenuClicked"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  render() {
    const { loading, source } = this.props;

    if (loading || !source) {
      return (
        <Dimmer className={`${classes.SourceRoot}`} active={true}>
          <Loader size="medium">Loading</Loader>
        </Dimmer>
      );
    }

    const { showingQuotes } = this.state;

    return (
      <div className={`${classes.SourceRoot}`}>
        <RootHeader title="Source" />

        <div className={`${classes.SourceRoot}`}>
          <div className={`${classes.SourceRoot}`}>
            <Header style={styles.tagText} as="h3" dividing={true}>
              {source.display}
            </Header>

            <div className={`${classes.mainContent}`}>
              <Menu
                style={{ ...(showingQuotes ? { opacity: 0 } : {}) }}
                className="yadayada"
                pointing={true}
                compact={true}
                icon="labeled"
                widths={2}
                fluid={true}
              >
                <Menu.Item onClick={this.newQuoteClicked}>
                  <Icon name="quote right" />
                  New Quote
                </Menu.Item>

                <Menu.Item onClick={this.quotesMenuClicked}>
                  <Icon name="numbered list" />
                  List Quotes
                </Menu.Item>
              </Menu>

              {showingQuotes && (
                <Quotes1QueryComponent
                  query={QUOTES_QUERY}
                  variables={{
                    quote: {
                      source: source.id
                    }
                  }}
                >
                  {({ data, loading: isLoading }) => {
                    if (isLoading || !data || !data.quotes) {
                      return (
                        <Dimmer
                          className={`${classes.SourceRoot}`}
                          active={true}
                        >
                          <Loader inverted={true} size="medium">
                            Loading
                          </Loader>
                        </Dimmer>
                      );
                    }

                    return (
                      <div className={`${classes.quotesContainer}`}>
                        <span
                          className={`${classes.quotesCloseButton}`}
                          onClick={this.quotesMenuCloseClicked}
                        >
                          {" "}
                          &times;{" "}
                        </span>
                        <List divided={true} relaxed={true}>
                          {data.quotes.map(renderQuote)}
                        </List>
                      </div>
                    );
                  }}
                </Quotes1QueryComponent>
              )}
            </div>
          </div>
        </div>

        <MobileBottomMenu items={[MenuItem.HOME, MenuItem.TAG_LIST]} />
      </div>
    );
  }

  quotesMenuClicked = () => this.setState(s => ({ ...s, showingQuotes: true }));

  quotesMenuCloseClicked = () =>
    this.setState(s => ({ ...s, showingQuotes: false }));

  newQuoteClicked = () => {
    const source = this.props.source;

    if (source) {
      this.props.history.push(makeNewQuoteURL(source.id));
    }
  };
}

const sourceGraphQl = graphql<
  OwnProps,
  Source1Query,
  Source1QueryVariables,
  {}
>(SOURCE_QUERY, {
  props: ({ data }) => {
    return { ...data };
  },

  options: ({ match }) => {
    return {
      variables: {
        source: {
          id: match.params.id
        }
      }
    };
  }
});

export default sourceGraphQl(Source);
