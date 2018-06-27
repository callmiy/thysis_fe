import React from "react";
import { Accordion } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import update from "immutability-helper";
import isEqual from "lodash/isEqual";

import { AuthorFragFragment } from "../../../graphql/gen.types";
import QUOTES_QUERY from "../../../graphql/quotes-1.query";
import { Quotes1QueryClientResult } from "../../../graphql/ops.types";
import { SourceFullFragFragment } from "../../../graphql/gen.types";
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
import AuthorsControlComponent from "../../../components/AuthorsControl";

export class SourceAccordion extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let { source } = props;
    source = (source ? { ...source } : undefined) as SourceFullFragFragment;
    this.state = update(initialState, {
      editedSource: {
        $set: source
      }
    });
  }

  getSnapshotBeforeUpdate(prevProps: Props, prevState: State) {
    // if we were editing and we change to view mode, then we cancel all
    // editing changes
    if (
      prevState.detailAction === DetailAction.EDITING &&
      this.state.detailAction === DetailAction.VIEWING
    ) {
      const { source } = this.props;
      const { editedSource } = prevState;

      if (isEqual(source, editedSource)) {
        return null;
      }

      return { editedSource: source };
    }
    return null;
  }

  // tslint:disable-next-line:no-any
  componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
    if (snapshot && snapshot.editedSource) {
      this.props.setValues(snapshot.editedSource);
    }
  }

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

    return (
      <Accordion.Content
        style={rootStyle}
        className={classes.detailsAccordionContent}
        active={activeIndex === 0}
      >
        {this.isEditing() ? (
          <Icon
            className={classes.editSourceIcon}
            name="eye"
            onClick={this.handleToggleEditView}
          />
        ) : (
          <Icon
            className={classes.editSourceIcon}
            name="edit"
            onClick={this.handleToggleEditView}
          />
        )}

        <div className={`source-type ${classes.root}`}>
          <div className={classes.labels}>Type</div>

          <div className={classes.details}>{sourceType.name}</div>
        </div>

        {(this.isEditing() || author) && (
          <div className={`${classes.root}`}>
            <div className={classes.labels}>Author</div>

            <div className={classes.details}>{author}</div>
          </div>
        )}

        <div className={`authors ${classes.root}`}>
          <div className={classes.labels}>Authors</div>

          <div className={classes.details}>
            {this.isEditing()
              ? this.renderAuthorsControl()
              : authors.map(this.renderAuthor)}
          </div>
        </div>

        {this.renderTextField(topic, "topic")}

        {this.renderTextField(year, "year")}

        {this.renderTextField(publication, "publication")}

        {this.renderTextField(url, "url", "URL")}
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

  // tslint:disable-next-line:no-any
  renderTextField = (value: any, name: string, label?: string) => {
    label = label ? label : name.charAt(0).toUpperCase() + name.slice(1);

    if (this.isEditing()) {
      return (
        <div className={`${classes.root}`}>
          <div className={classes.labels}> {label} </div>

          <div className={classes.details}>{this.renderTextControl(name)}</div>
        </div>
      );
    }

    if (value) {
      return (
        <div className={`${classes.root}`}>
          <div className={classes.labels}> {label} </div>

          <div className={classes.details}>{value}</div>
        </div>
      );
    }

    return undefined;
  };

  renderAuthorsControl = () => {
    const name = "authors";
    const error = this.props.errors[name];
    const booleanError = !!error;
    const touched = !!this.props.touched[name];

    return (
      <div className={classes.fieldWrapper}>
        <Form.Field
          control={AuthorsControlComponent}
          error={booleanError}
          selectError={booleanError}
          name={name}
          value={this.props.values[name]}
          handleBlur={this.handleFormControlBlur(name)}
          handleChange={this.handleControlChange(name)}
        />

        {this.renderFieldError(booleanError && touched, error)}
      </div>
    );
  };

  renderTextControl = (name: string) => {
    const error = this.props.errors[name];
    const booleanError = !!error;
    const touched = !!this.props.touched[name];

    return (
      <div className={classes.fieldWrapper}>
        <Form.Field
          control={Input}
          placeholder={name}
          fluid={true}
          id={name}
          error={booleanError}
          autoComplete="off"
          value={this.props.values[name] || ""}
          onBlur={this.props.handleBlur}
          onChange={this.handleControlChange(name)}
        />

        {this.renderFieldError(booleanError && touched, error)}
      </div>
    );
  };

  renderFieldError = (show: boolean, error: string) => {
    return show ? (
      <div className={classes.errorMessage}> {error} </div>
    ) : (
      undefined
    );
  };

  handleFormControlBlur = (name: string) => () => {
    this.props.setFieldTouched(name, true);
  };

  handleControlChange = (name: string) => async (
    // tslint:disable-next-line:no-any
    val: any,
    // tslint:disable-next-line:no-any
    other: any
  ) => {
    val = other ? other.value : val;
    this.props.setFieldValue(name, val);

    this.setState(s =>
      update(s, {
        editedSource: {
          [name]: {
            $set: val
          }
        }
      })
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

  private isEditing = () => this.state.detailAction === DetailAction.EDITING;
}

export default SourceAccordion;
