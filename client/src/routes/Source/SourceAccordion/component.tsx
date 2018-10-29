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
import isEmpty from "lodash/isEmpty";

import {
  AuthorFrag,
  SourceTypeFrag,
  Quotes1,
  Quotes1Variables
} from "../../../graphql/gen.types";
import { Quotes1_quotes } from "../../../graphql/gen.types";
import QUOTES_QUERY from "../../../graphql/quotes-1.query";
import { authorDisplay } from "../../../graphql/utils";
import { authorFullName } from "../../../graphql/utils";
import { classes } from "./styles";
import { accordionContentStyle } from "./styles";
import { initialState } from "./utils";
import { DetailAction } from "./utils";
import { AccordionTitleClickCb } from "./utils";
import { Props } from "./utils";
import { State } from "./utils";
import { SourceAccordionIndex } from "./utils";
import renderQuote from "../../../components/QuoteItem";
import AuthorsControlComponent from "../../../components/AuthorsControl";
import SourceTypeControlComponent from "../../../components/SourceTypeControl";
import SOURCE_QUERY from "../../../graphql/source-full.query";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";

export class SourceAccordion extends React.Component<Props, State> {
  state: State = initialState;

  getSnapshotBeforeUpdate(prevProps: Props, prevState: State) {
    // if we were editing and we change view, then we cancel all
    // editing changes
    if (
      prevState.detailAction === DetailAction.EDITING &&
      this.state.detailAction === DetailAction.VIEWING
    ) {
      if (this.shouldResetEditSourceForm()) {
        return { resetForm: true };
      }
    }
    return null;
  }

  // tslint:disable-next-line:no-any
  componentDidUpdate(prevProps: Props, prevState: State, snapshot: any) {
    if (snapshot && snapshot.resetForm) {
      this.props.resetForm();
    }
  }

  render() {
    const { activeIndex } = this.state;

    return (
      <Accordion fluid={true} styled={true} className={classes.accordion}>
        {this.renderEditViewControls()}

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
      source: { sourceType, authors, year, topic, publication, url }
    } = this.props;

    return (
      <Accordion.Content
        style={accordionContentStyle}
        className={classes.detailsAccordionContent}
        active={activeIndex === 0}
      >
        {this.renderUpdatingUI()}

        <div className={`source-type ${classes.root}`}>
          <div className={classes.labels}>Type</div>

          <div className={classes.details}>
            {this.renderSourceType(sourceType)}
          </div>
        </div>

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

  renderEditViewControls = () => {
    if (this.state.activeIndex !== SourceAccordionIndex.DETAIL) {
      return undefined;
    }

    if (this.isEditing()) {
      const { errors, source, values } = this.props;

      return (
        <div className={classes.toggleEditView}>
          <Icon
            className="editing-icon"
            name="remove"
            color="red"
            onClick={this.handleToggleEditView}
          />

          {!isEqual(source, values) &&
            isEmpty(errors) && (
              <Icon
                className="editing-icon"
                name="checkmark"
                color="green"
                onClick={this.submit}
              />
            )}
        </div>
      );
    }

    return (
      <div className={classes.toggleEditView}>
        <Icon
          className="edit-icon"
          name="edit"
          onClick={this.handleToggleEditView}
        />
      </div>
    );
  };

  renderAuthor = (author: AuthorFrag) => {
    return (
      <div key={author.id}>
        {authorFullName(author)} ({authorDisplay(author)})
      </div>
    );
  };

  renderUpdatingUI = () => {
    const { isSubmitting } = this.props;
    const { updateSourceError, openUpdateSourceSuccessModal } = this.state;

    if (updateSourceError) {
      return (
        <ErrorModal
          error={updateSourceError}
          open={!!updateSourceError}
          dismiss={this.handleDismissErrorModal}
        />
      );
    }

    if (openUpdateSourceSuccessModal) {
      return (
        <SuccessModal
          open={openUpdateSourceSuccessModal}
          dismiss={this.handleDismissSuccessModal}
        />
      );
    }

    if (isSubmitting) {
      return this.renderLoader("Updating...");
    }

    return undefined;
  };

  renderAccordionQuotes = (activeIndex: number) => {
    return (
      <Accordion.Content
        className={classes.quotesAccordion}
        style={accordionContentStyle}
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
      return this.renderLoader("Loading quotes...");
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

  renderLoader = (label: string) => {
    return (
      <Dimmer inverted={true} className={`${classes.SourceRoot}`} active={true}>
        <Loader inverted={true} size="medium">
          {label}
        </Loader>
      </Dimmer>
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

  renderSourceTypeControl = () => {
    const name = "sourceType";
    const error = this.props.errors[name];
    const booleanError = !!error;
    const touched = !!this.props.touched[name];

    return (
      <div className={classes.fieldWrapper}>
        <Form.Field
          control={SourceTypeControlComponent}
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

  renderSourceType = (sourceType: SourceTypeFrag) => {
    if (this.isEditing()) {
      return this.renderSourceTypeControl();
    }

    return sourceType.name;
  };

  renderTextControl = (name: string) => {
    const error = this.props.errors[name];
    const booleanError = !!error;
    const touched = !!this.props.touched[name];

    return (
      <div className={classes.fieldWrapper}>
        <Form.Field
          className={error ? classes.error : ""}
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
  };

  handleAccordionClick: AccordionTitleClickCb = (event, titleProps) => {
    const index = titleProps.index as SourceAccordionIndex;
    const { activeIndex } = this.state;

    if (index === SourceAccordionIndex.LIST_QUOTES) {
      this.fetchQuotes();
    }

    this.setState(s =>
      update(s, {
        activeIndex: {
          $set: activeIndex === index ? SourceAccordionIndex.NO_MATCH : index
        },
        ...this.getNewDetailState(index as number)
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

  handleDismissSuccessModal = () => {
    this.setState(s =>
      update(s, {
        openUpdateSourceSuccessModal: {
          $set: false
        },

        detailAction: {
          $set: DetailAction.VIEWING
        }
      })
    );
  };

  handleDismissErrorModal = () => {
    this.setState(s =>
      update(s, {
        updateSourceError: {
          $set: undefined
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

      const result = await this.props.client.query<Quotes1, Quotes1Variables>({
        query: QUOTES_QUERY,
        variables: {
          quote: {
            source: this.props.source.id
          }
        }
      });

      const quotes = result.data.quotes as Quotes1_quotes[];

      this.setState(s =>
        update(s, {
          quotes: {
            $set: quotes
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

  private submit = async () => {
    const { values, setSubmitting, updateSource, source } = this.props;
    const {
      sourceType: { id },
      authors,
      year,
      topic,
      publication,
      url
    } = values;

    setSubmitting(true);

    const previousAuthors = source.authors.map((a: AuthorFrag) => a && a.id);
    const authorIds = authors.map((a: AuthorFrag) => a && a.id);

    const updatedSource = {
      id: values.id,
      sourceTypeId: id,
      authorIds: authorIds.filter((a: string) => !previousAuthors.includes(a)),
      deletedAuthors: previousAuthors.filter(
        (a: string) => !authorIds.includes(a)
      ),
      year,
      topic,
      publication,
      url
    };

    try {
      await updateSource({
        variables: {
          source: updatedSource
        },

        update: (client, { data: newData }) => {
          if (!newData) {
            return;
          }

          const newSource = newData.updateSource;

          if (!newSource) {
            return;
          }

          client.writeQuery({
            query: SOURCE_QUERY,
            variables: {
              source: {
                id: source.id
              }
            },
            data: newSource
          });
        }
      });

      setSubmitting(false);

      this.setState(s =>
        update(s, {
          openUpdateSourceSuccessModal: {
            $set: true
          }
        })
      );
    } catch (error) {
      setSubmitting(false);

      this.setState(s =>
        update(s, {
          updateSourceError: {
            $set: error
          }
        })
      );
    }
  };

  private isEditing = () =>
    this.state.activeIndex === SourceAccordionIndex.DETAIL &&
    this.state.detailAction === DetailAction.EDITING;

  private shouldResetEditSourceForm = () => {
    const { source } = this.props;
    const editedSource = this.props.values;

    return !isEqual(source, editedSource);
  };

  private getNewDetailState = (index: number) => {
    if (index !== SourceAccordionIndex.DETAIL) {
      return {};
    }

    if (this.state.detailAction === DetailAction.VIEWING) {
      return {};
    }

    return {
      detailAction: {
        $set: DetailAction.VIEWING
      }
    };
  };
}

export default SourceAccordion;
