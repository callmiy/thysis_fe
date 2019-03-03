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
import { NavLink } from "react-router-dom";

import {
  AuthorFrag,
  SourceTypeFrag,
  Quotes1,
  Quotes1Variables
} from "../../../graphql/gen.types";
import { Quotes1_quotes } from "../../../graphql/gen.types";
import QUOTES_QUERY from "../../../graphql/quotes-1.query";
import { sourceDisplay } from "../../../graphql/utils";
import { authorFullName } from "../../../graphql/utils";
import { classes } from "./styles";
import { accordionContentStyle } from "./styles";
import { initialState } from "./source-accordion";
import { DetailAction } from "./source-accordion";
import { AccordionTitleClickCb } from "./source-accordion";
import { Props } from "./source-accordion";
import { State } from "./source-accordion";
import { AccordionIndex } from "./source-accordion";
import renderQuote from "../../../components/QuoteItem";
import AuthorsControlComponent from "../../../components/AuthorsControl";
import SourceTypeControlComponent from "../../../components/SourceTypeControl";
import SOURCE_QUERY from "../../../graphql/source-full.query";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import { makeAuthorRouteURL } from "../../../routes/util";

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
    const { accordionProps } = this.state;

    return (
      <Accordion
        fluid={true}
        styled={true}
        className={classes.accordion}
        exclusive={false}
      >
        {this.renderEditViewControls()}

        <Accordion.Title
          active={accordionProps[AccordionIndex.DETAIL]}
          index={AccordionIndex.DETAIL}
          onClick={this.handleAccordionClick}
        >
          <Icon name="dropdown" />
          Details
        </Accordion.Title>

        {this.renderDetail()}

        <Accordion.Title
          active={accordionProps[AccordionIndex.LIST_QUOTES]}
          index={AccordionIndex.LIST_QUOTES}
          onClick={this.handleAccordionClick}
        >
          <Icon name="dropdown" />
          Quotes
        </Accordion.Title>

        {this.renderAccordionQuotes()}
      </Accordion>
    );
  }

  renderDetail = () => {
    const { source } = this.props;

    const { sourceType, authors, year, topic, publication, url } = source;

    const { accordionProps } = this.state;

    return (
      <Accordion.Content
        style={accordionContentStyle}
        className={classes.detailsAccordionContent}
        active={accordionProps[AccordionIndex.DETAIL]}
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

        <div>
          <div style={{ fontWeight: "bolder", fontSize: "1.2rem" }}>
            Citation
          </div>
          <div>{sourceDisplay(source)}</div>
        </div>
      </Accordion.Content>
    );
  };

  renderEditViewControls = () => {
    const { accordionProps } = this.state;

    if (!accordionProps[AccordionIndex.DETAIL]) {
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

          {!isEqual(source, values) && isEmpty(errors) && (
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

  renderAuthor = (author: AuthorFrag | null) => {
    if (!author) {
      return undefined;
    }

    return (
      <div key={author.id}>
        <NavLink to={makeAuthorRouteURL(author.id)}>
          {authorFullName(author)}
        </NavLink>
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

  renderAccordionQuotes = () => {
    const { accordionProps } = this.state;
    return (
      <Accordion.Content
        className={classes.quotesAccordion}
        style={accordionContentStyle}
        active={accordionProps[AccordionIndex.LIST_QUOTES]}
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

          {name === "url" ? (
            <a style={{ paddingLeft: "15px" }} href={value}>
              {value}
            </a>
          ) : (
            <div className={classes.details}>{value}</div>
          )}
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

  renderFieldError = (show: boolean, error: string | undefined) => {
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
    const index = titleProps.index as AccordionIndex;

    if (index === AccordionIndex.LIST_QUOTES) {
      this.fetchQuotes();
    }

    const { accordionProps } = this.state;

    this.setState(s =>
      update(s, {
        accordionProps: {
          [index]: {
            $set: !accordionProps[index]
          }
        },
        ...this.getNewDetailState(index as number)
      })
    );
  };

  handleToggleEditView = () => {
    this.setState({
      detailAction:
        this.state.detailAction === DetailAction.VIEWING
          ? DetailAction.EDITING
          : DetailAction.VIEWING
    });
  };

  handleDismissSuccessModal = () => {
    this.setState({
      openUpdateSourceSuccessModal: false,
      detailAction: DetailAction.VIEWING
    });
  };

  handleDismissErrorModal = () => {
    this.setState({ updateSourceError: undefined });
  };

  private fetchQuotes = async () => {
    try {
      this.setState({ loadingQuotes: true });

      const result = await this.props.client.query<Quotes1, Quotes1Variables>({
        query: QUOTES_QUERY,
        variables: {
          quote: {
            source: this.props.source.id
          }
        }
      });

      const quotes = result.data.quotes as Quotes1_quotes[];
      this.setState({ quotes, loadingQuotes: false });
    } catch (error) {
      this.setState({ loadingQuotes: false, fetchQuotesError: error });
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

    const previousAuthors = source.authors.map(
      (a: null | AuthorFrag) => a && a.id
    );
    const authorIds = authors.map((a: AuthorFrag) => a && a.id);

    const updatedSource = {
      id: values.id,
      sourceTypeId: id,
      authorIds: authorIds.filter((a: string) => !previousAuthors.includes(a)),
      deletedAuthors: previousAuthors.filter(
        (a: string | null) => a && !authorIds.includes(a)
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
      this.setState({ openUpdateSourceSuccessModal: true });
    } catch (error) {
      setSubmitting(false);
      this.setState({ updateSourceError: error });
    }
  };

  private isEditing = () => {
    const { detailAction, accordionProps } = this.state;

    return (
      accordionProps[AccordionIndex.DETAIL] &&
      detailAction === DetailAction.EDITING
    );
  };

  private shouldResetEditSourceForm = () => {
    const { source } = this.props;
    const editedSource = this.props.values;

    return !isEqual(source, editedSource);
  };

  private getNewDetailState = (index: number) => {
    if (index !== AccordionIndex.DETAIL) {
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
