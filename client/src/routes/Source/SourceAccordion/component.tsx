import React from "react";
import { Accordion } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import update from "immutability-helper";

import { AuthorFragFragment } from "../../../graphql/gen.types";
import QUOTES_QUERY from "../../../graphql/quotes-1.query";
import { Quotes1QueryClientResult } from "../../../graphql/ops.types";
import { classes } from "./styles";
import { rootStyle } from "./styles";
import { quotesAccordion } from "./styles";
import { initialState } from "./utils";
import { DetailAction } from "./utils";
import { AccordionTitleClickCb } from "./utils";
import { Props } from "./utils";
import { State } from "./utils";
import { SourceAccordionIndex } from "./utils";
import renderQuote from "../../../components/QuoteItem";

export class SourceAccordion extends React.Component<Props, State> {
  state = initialState;

  render() {
    const { activeIndex } = this.state;

    return (
      <Accordion fluid={true} styled={true} className={classes.accordion}>
        <Accordion.Title
          active={activeIndex === SourceAccordionIndex.DETAIL}
          index={SourceAccordionIndex.DETAIL}
          onClick={this.handleAccordionClick}
        >
          <Icon name="dropdown" />
          Details
        </Accordion.Title>

        {this.renderDetail(activeIndex)}

        <Accordion.Title
          active={activeIndex === SourceAccordionIndex.LIST_QUOTES}
          index={SourceAccordionIndex.LIST_QUOTES}
          onClick={this.handleAccordionClick}
        >
          <Icon name="dropdown" />
          Quotes
        </Accordion.Title>

        {this.renderAccordionQuotes(activeIndex)}
      </Accordion>
    );
  }

  renderDetail = (activeIndex: number) => {
    const {
      source: { sourceType, authors, year, topic, publication, url, author }
    } = this.props;

    const { detailAction } = this.state;

    return (
      <Accordion.Content
        style={rootStyle}
        className={classes.detailsAccordionContent}
        active={activeIndex === 0}
      >
        {detailAction === DetailAction.VIEWING ? (
          <Icon
            className={classes.editSourceIcon}
            name="edit"
            onClick={this.handleToggleEditView}
          />
        ) : (
          <Icon
            className={classes.editSourceIcon}
            name="eye"
            onClick={this.handleToggleEditView}
          />
        )}

        <div className={`source-type ${classes.root}`}>
          <div className={classes.labels}>Type</div>

          <div className={classes.details}>{sourceType.name}</div>
        </div>

        {author && (
          <div className={`${classes.root}`}>
            <div className={classes.labels}>Author</div>

            <div className={classes.details}>{author}</div>
          </div>
        )}

        <div className={`authors ${classes.root}`}>
          <div className={classes.labels}>Authors</div>

          <div className={classes.details}>
            {authors && authors.map(this.renderAuthor)}
          </div>
        </div>

        <div className={`topic ${classes.root}`}>
          <div className={classes.labels}>Topic</div>

          <div className={classes.details}>{topic}</div>
        </div>

        {year && (
          <div className={`${classes.root}`}>
            <div className={classes.labels}>Year</div>

            <div className={classes.details}>{year}</div>
          </div>
        )}

        {publication && (
          <div className={`${classes.root}`}>
            <div className={classes.labels}>Publication</div>

            <div className={classes.details}>{publication}</div>
          </div>
        )}

        {url && (
          <div className={`${classes.root}`}>
            <div className={classes.labels}>URL</div>

            <div className={classes.details}>{url}</div>
          </div>
        )}
      </Accordion.Content>
    );
  };

  renderAuthor = ({ id, name }: AuthorFragFragment) => {
    return <div key={id}>{name}</div>;
  };

  renderAccordionQuotes = (activeIndex: number) => {
    return (
      <Accordion.Content
        className={classes.quotesAccordion}
        style={quotesAccordion}
        active={activeIndex === 1}
      >
        {this.renderAccordionContentQuotes()}
      </Accordion.Content>
    );
  };

  renderAccordionContentQuotes = () => {
    const { loadingQuotes, fetchQuotesError } = this.state;

    if (fetchQuotesError) {
      return (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(fetchQuotesError, null, 2)}
        </pre>
      );
    }

    if (loadingQuotes) {
      return (
        <Dimmer
          inverted={true}
          className={`${classes.SourceRoot}`}
          active={true}
        >
          <Loader inverted={true} size="medium">
            Loading quotes...
          </Loader>
        </Dimmer>
      );
    }

    const { quotes } = this.state;

    if (!quotes || !quotes.length) {
      return (
        <div>
          <div>No quote for source</div>
          <p>Click New Quote to add quote</p>
        </div>
      );
    }

    return (
      <List divided={true} relaxed={true}>
        {quotes.map(renderQuote)}
      </List>
    );
  };

  handleAccordionClick: AccordionTitleClickCb = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;

    if (index === SourceAccordionIndex.LIST_QUOTES) {
      this.fetchQuotes();
    }

    this.setState(s =>
      update(s, {
        activeIndex: {
          $set: activeIndex === index ? -1 : index
        }
      })
    );
  };

  handleToggleEditView = () => {
    this.setState(s =>
      update(s, {
        detailAction: {
          $set:
            this.state.detailAction === DetailAction.VIEWING
              ? DetailAction.EDITING
              : DetailAction.VIEWING
        }
      })
    );
  };

  private fetchQuotes = async () => {
    try {
      this.setState(s =>
        update(s, {
          loadingQuotes: {
            $set: true
          }
        })
      );

      const result = (await this.props.client.query({
        query: QUOTES_QUERY,
        variables: {
          quote: {
            source: this.props.source.id
          }
        }
      })) as Quotes1QueryClientResult;

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
}

export default SourceAccordion;
