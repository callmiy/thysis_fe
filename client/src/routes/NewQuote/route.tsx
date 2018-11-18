import * as React from "react";
import { Formik } from "formik";
import { FormikProps } from "formik";
import { Field } from "formik";
import { FieldProps } from "formik";
import { FormikErrors } from "formik";
import { ApolloQueryResult } from "apollo-client";
import isEmpty from "lodash/isEmpty";
import { Header } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { TextArea } from "semantic-ui-react";
import { Message } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import update from "immutability-helper";
import { Mutation } from "react-apollo";
import { NavLink } from "react-router-dom";
import dateIsValid from "date-fns/isValid";

import {
  Quotes1 as Quotes1Query,
  Sources1QueryVariables,
  Source1Variables
} from "../../graphql/gen.types";
import { TagFrag } from "../../graphql/gen.types";
import { SourceFullFrag } from "../../graphql/gen.types";
import { Sources1Query } from "../../graphql/gen.types";
import { Source1 as Source1Query } from "../../graphql/gen.types";
import { sourceDisplay } from "../../graphql/utils";
import TagControl from "./form-tag-control.component";
import SourceControl from "./form-source-control.component";
import Date from "./date.component";
import { DateType } from "./date.component";
import { makeSourceURL } from "../../routes/util";
import Page from "./form-page-start-end-control.component";
import { PageType } from "./form-page-start-end-control.component";
import VolumeIssue from "./form-volume-issue-control.component";
import { VolumeIssueType } from "./form-volume-issue-control.component";
import QUOTE_MUTATION from "../../graphql/quote.mutation";
import { CreateQuoteFn } from "../../graphql/ops.types";
import { CreateQuoteUpdateFn } from "../../graphql/ops.types";
import SOURCES_QUERY from "../../graphql/sources-1.query";
import SOURCE_QUERY from "../../graphql/source.query";
import RootHeader from "../../components/Header";
import QUOTES_QUERY from "../../graphql/quotes-1.query";
import { ErrorModal } from "./error-modal.component";
import SuccessModal from "./SuccessModal";
import { setTitle } from "../../routes/util";
import { makeNewQuoteURL } from "../../routes/util";
import { styles } from "./styles";
import { inlineStyle } from "./styles";
import { classes } from "./styles";
import { ShouldReUseSource } from "./new-quote";
import { FormValues } from "./new-quote";
import { State } from "./new-quote";
import { Props } from "./new-quote";
import QuotesSidebar from "./QuotesSidebar";
import { initialFormValues } from "./new-quote";
import { formOutputs } from "./new-quote";
import AppSideBar from "src/components/AppSidebar";

export class NewQuote extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, currentState: State) {
    const { sourceId } = nextProps.match.params;

    if (sourceId !== currentState.sourceId) {
      return update(currentState, {
        sourceId: {
          $set: sourceId
        },
        queryResult: {
          $set: undefined
        }
      });
    }

    return null;
  }

  state: State = {
    initialFormValues,
    formOutputs,
    selectedTags: []
  };

  formContainerRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.fetchSource();

    setTitle("New quote");
  }

  componentDidUpdate() {
    if (!this.state.queryResult) {
      this.fetchSource();
    }
  }

  componentWillUnmount() {
    setTitle();
  }

  fetchSource = async () => {
    try {
      let query;

      if (this.state.sourceId) {
        query = await this.props.client.query<Source1Query, Source1Variables>({
          query: SOURCE_QUERY,
          variables: {
            source: {
              id: this.state.sourceId
            }
          }
        });
      } else {
        const { currentProject } = this.props;

        if (!currentProject) {
          return;
        }

        query = await this.props.client.query<
          Sources1Query,
          Sources1QueryVariables
        >({
          query: SOURCES_QUERY,
          variables: {
            source: {
              projectId: currentProject ? currentProject.id : "0"
            }
          }
        });
      }

      if (!query) {
        return;
      }

      const result = query as ApolloQueryResult<Sources1Query & Source1Query>;

      this.setState(s =>
        update(s, {
          queryResult: {
            $set: result
          },

          initialFormValues: {
            source: {
              $set: result.data.source
            }
          }
        })
      );
    } catch (error) {
      // tslint:disable-next-line:no-any
      const result = { data: { sources: [] } } as any;
      this.setState({ graphqlError: error, queryResult: result });
    }
  };

  render() {
    return (
      <AppSideBar onTagCreated={this.onTagCreated}>
        <div className={classes.newQuoteRoot}>
          <RootHeader
            className={classes.rootHeader}
            style={{ margin: 0 }}
            title="New Quote"
            showSideBarTrigger={true}
          />

          <div className={classes.rootInner}>
            <div className={classes.formWithHeader}>
              {this.state.sourceId && this.renderSourceQuoteHeader()}

              <div
                className={`${classes.mainContent}`}
                ref={this.formContainerRef}
              >
                {this.renderErrorOrSuccess()}

                <Mutation
                  mutation={QUOTE_MUTATION}
                  variables={{ quote: this.state.formOutputs }}
                  update={this.writeQuoteToCache}
                >
                  {createQuote => {
                    return (
                      <Formik
                        initialValues={this.state.initialFormValues}
                        enableReinitialize={true}
                        onSubmit={this.submit(createQuote)}
                        render={this.renderForm}
                        validate={this.validate}
                      />
                    );
                  }}
                </Mutation>
              </div>
            </div>

            <QuotesSidebar className={classes.quotesSidebar} />
          </div>
        </div>
      </AppSideBar>
    );
  }

  renderErrorOrSuccess = () => {
    const { sourceId, graphqlError, submittedSourceId } = this.state;

    if (graphqlError) {
      return (
        <ErrorModal
          open={!!graphqlError}
          dismiss={this.dismissErrorModal}
          error={graphqlError}
        />
      );
    }

    if (submittedSourceId) {
      return (
        <SuccessModal
          open={!!submittedSourceId}
          dismiss={this.onSuccessModalDismissed}
          reUseSource={!!sourceId}
        />
      );
    }

    return undefined;
  };

  renderSourceQuoteHeader = () => {
    const { source } = this.state.initialFormValues;

    return (
      <Header dividing={true} style={styles.quoteSourceDisplayContainer}>
        {source && (
          <NavLink className={classes.quoteLink} to={makeSourceURL(source.id)}>
            <div style={inlineStyle.quoteSourceLabel}>
              Click to go to source
            </div>

            <div className={`${classes.quoteSourceDisplay}`}>
              {sourceDisplay(source)}
            </div>
          </NavLink>
        )}
      </Header>
    );
  };

  writeQuoteToCache: CreateQuoteUpdateFn = async (
    cache,
    { data: quoteData }
  ) => {
    if (!quoteData || !quoteData.createQuote) {
      return;
    }

    const { createQuote } = quoteData;

    const sourceId = this.state.formOutputs.sourceId;

    const query = {
      query: QUOTES_QUERY,
      variables: {
        quote: {
          source: sourceId
        }
      }
    };

    try {
      const quotesQuery = cache.readQuery(query) as Quotes1Query;
      const quotes = quotesQuery.quotes || [];

      cache.writeQuery({
        ...query,
        data: {
          quotes: [createQuote, ...quotes]
        }
      });
    } catch (error) {
      const message = error.message;
      const queryErrorStart = `Can't find field quotes({"quote":{"source":"${sourceId}"}})`;

      if (message.startsWith(queryErrorStart)) {
        return;
      }

      throw error;
    }
  };

  validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    for (const key of Object.keys(values)) {
      const error = this[
        `validate${key.charAt(0).toUpperCase()}${key.slice(1)}`
      ](values[key]);

      if (error) {
        errors[key] = error;
        return errors;
      }
    }

    return errors;
  };

  renderForm = ({
    handleReset,
    dirty,
    isSubmitting,
    errors,
    handleSubmit
  }: FormikProps<FormValues>) => {
    const dirtyOrSubmitting = !dirty || isSubmitting;
    const disableSubmit = dirtyOrSubmitting || !isEmpty(errors);
    const { sourceId } = this.state;

    return (
      <Form onSubmit={handleSubmit}>
        <Dimmer inverted={true} active={isSubmitting}>
          <Loader active={isSubmitting} size="medium">
            Saving..
          </Loader>
        </Dimmer>

        <Field name="tags" render={this.renderTagControl} />

        {!sourceId && <Field name="source" render={this.renderSourceControl} />}

        <Field name="quote" render={this.renderQuoteControl} />
        <Field name="page" render={this.renderPageControl} />
        <Field name="volumeIssue" render={this.renderVolumeIssueControl} />
        <Field name="date" render={this.renderDateControl} />
        <Field name="extras" render={this.renderExtrasControl} />

        <div className={`${classes.submitReset}`}>
          <Button
            basic={true}
            color="red"
            onClick={this.onResetClicked(handleReset)}
            disabled={dirtyOrSubmitting}
          >
            <Icon name="remove" /> Reset
          </Button>

          <Button
            className={`${classes.submitButton}`}
            type="submit"
            color="green"
            disabled={disableSubmit}
            loading={isSubmitting}
          >
            <Icon name="checkmark" /> Ok
          </Button>
        </div>
      </Form>
    );
  };

  submit = (createQuote: CreateQuoteFn) => async (
    values: FormValues,
    formikBag: FormikProps<FormValues>
  ) => {
    formikBag.setSubmitting(true);

    try {
      await createQuote();
      formikBag.resetForm();

      this.setState(s =>
        update(s, {
          submittedSourceId: {
            $set: values.source && values.source.id
          },

          initialFormValues: {
            tags: {
              $set: []
            }
          }
        })
      );

      this.scrollToTopOfForm();
    } catch (error) {
      formikBag.setSubmitting(false);
      this.setState({ graphqlError: error });
    }
  };

  onTagCreated = (tag: TagFrag) => {
    this.setState(s =>
      update(s, {
        initialFormValues: {
          tags: {
            $set: [...this.state.selectedTags, tag]
          }
        }
      })
    );
  };

  renderTagControl = (formProps: FieldProps<FormValues>) => {
    const {
      field: { name, value },
      form
    } = formProps;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];
    const tags = this.props.tags as TagFrag[];

    return (
      <div className={classes.tagsField}>
        <Form.Field
          control={TagControl}
          label="Select at least one tag"
          error={booleanError}
          selectError={booleanError}
          tags={tags || []}
          name={name}
          value={value}
          handleChange={this.onTagSelected(formProps)}
          handleBlur={this.handleFormControlBlur(name, form)}
        >
          {booleanError && touched && <Message error={true} header={error} />}
        </Form.Field>
      </div>
    );
  };

  onTagSelected = ({ form, field }: FieldProps<FormValues>) => (
    value: TagFrag[]
  ) => {
    form.setFieldValue(field.name, value);
    this.setState(s =>
      update(s, {
        selectedTags: {
          $set: value
        }
      })
    );
  };

  handleFormControlBlur = (
    name: string,
    form: FormikProps<FormValues>
  ) => () => {
    form.setFieldTouched(name, true);
  };

  handleControlChange = (name: string, form: FormikProps<FormValues>) => (
    val: undefined | VolumeIssueType | SourceFullFrag | PageType | DateType
  ) => form.setFieldValue(name, val);

  renderQuoteControl = (formProps: FieldProps<FormValues>) => {
    const { field, form } = formProps;
    const { name } = field;
    const error = form.errors[name];
    const booleanError = !!error;
    // const touched = form.touched[name];
    const label = "Quote text";

    return (
      <Form.Field
        control={TextArea}
        placeholder={label}
        label={label}
        id={name}
        error={booleanError}
        {...field}
      />
    );
  };

  renderExtrasControl = (formProps: FieldProps<FormValues>) => {
    const { field, form } = formProps;
    const { name } = field;
    const error = form.errors[name];
    const booleanError = !!error;
    // const touched = form.touched[name];
    const label = "Extras";

    return (
      <Form.Field
        control={TextArea}
        placeholder={label}
        label={label}
        id={name}
        error={booleanError}
        {...field}
      />
    );
  };

  renderDateControl = (formik: FieldProps<FormValues>) => {
    const { field, form } = formik;
    const { name } = field;
    const error = form.errors[name];
    const booleanError = !!error;
    // const touched = form.touched[name];

    return (
      <Date
        className={`${booleanError ? classes.errorBorder : ""}`}
        onChange={this.handleControlChange(name, form)}
        onBlur={this.handleFormControlBlur(name, form)}
        value={field.value}
      />
    );
  };

  renderPageControl = (formik: FieldProps<FormValues>) => {
    const { field, form } = formik;
    const { name } = field;
    const error = form.errors[name];
    const booleanError = !!error;

    return (
      <Page
        className={`${booleanError ? classes.errorBorder : ""}`}
        onChange={this.handleControlChange(name, form)}
        onBlur={this.handleFormControlBlur(name, form)}
        value={field.value}
      />
    );
  };

  renderVolumeIssueControl = (formik: FieldProps<FormValues>) => {
    const { field, form } = formik;
    const { name } = field;
    const error = form.errors[name];
    const booleanError = !!error;

    return (
      <VolumeIssue
        className={`${booleanError ? classes.errorBorder : ""}`}
        onChange={this.handleControlChange(name, form)}
        onBlur={this.handleFormControlBlur(name, form)}
        value={field.value}
      />
    );
  };

  renderSourceControl = (formProps: FieldProps<FormValues>) => {
    const {
      field: { name, value },
      form
    } = formProps;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];

    return (
      <Form.Field
        control={SourceControl}
        label="Select source"
        error={booleanError}
        selectError={booleanError}
        sources={this.getSources()}
        name={name}
        value={value}
        handleBlur={this.handleFormControlBlur(name, form)}
        handleChange={this.handleControlChange(name, form)}
      >
        {booleanError && touched && <Message error={true} header={error} />}
      </Form.Field>
    );
  };

  getSources = () => {
    const { queryResult } = this.state;

    if (!queryResult) {
      return [] as SourceFullFrag[];
    }

    const { data } = queryResult;

    if (!data) {
      return [] as SourceFullFrag[];
    }

    if (data.source) {
      return [data.source];
    }

    return data.sources;
  };

  validateQuote = (quote: string | null) => {
    const error = "Enter a quote";

    if (!quote) {
      return error;
    }

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          text: {
            $set: quote
          }
        }
      })
    );

    return "";
  };

  validateExtras = (extras: string | null) => {
    if (!extras) {
      return "";
    }

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          extras: {
            $set: extras
          }
        }
      })
    );

    return "";
  };

  validateSource = (source: SourceFullFrag | null) => {
    const error = "Select a source";

    if (!source) {
      return error;
    }

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          sourceId: {
            $set: source.id
          }
        }
      })
    );

    return "";
  };

  validateTags = (tags: TagFrag[] | null) => {
    const error = "Select at least one tag";

    if (!tags || !tags.length) {
      return error;
    }

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          tags: {
            $set: tags.map(t => t.id)
          }
        }
      })
    );

    return "";
  };

  validateDate = (date: DateType | null) => {
    const error = "Enter a valid date";

    if (!date) {
      this.setState(prev =>
        update(prev, {
          formOutputs: {
            date: {
              $set: undefined
            }
          }
        })
      );

      return "";
    }

    const keys = Object.keys(date);

    if (keys.length !== 3) {
      return error;
    }

    const { year, month, day: noPaddedDay } = date;

    if (!(year && month && noPaddedDay)) {
      return error;
    }

    const day = `${noPaddedDay}`.padStart(2, "0");

    const inputDate = `${year}-${month}-${day}`;
    const isValid = dateIsValid(inputDate);

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          date: {
            $set: isValid ? inputDate : undefined
          }
        }
      })
    );

    return isValid ? "" : error;
  };

  validatePage = (page: PageType | null) => {
    if (!page) {
      return "";
    }

    const { start, end } = page;

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          pageStart: {
            $set: start
          },

          pageEnd: {
            $set: end
          }
        }
      })
    );

    return "";
  };

  validateVolumeIssue = (volumeIssue: VolumeIssueType | null) => {
    if (!volumeIssue) {
      return "";
    }

    const { volume, issue } = volumeIssue;

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          volume: {
            $set: volume
          },

          issue: {
            $set: issue
          }
        }
      })
    );

    return "";
  };

  scrollToTopOfForm = () => {
    if (this.formContainerRef.current) {
      this.formContainerRef.current.scrollTop = 0;
    }
  };

  onResetClicked = (reset: () => void) => () => {
    reset();
    this.scrollToTopOfForm();
  };

  dismissErrorModal = () => {
    this.setState(s =>
      update(s, {
        graphqlError: {
          $set: undefined
        }
      })
    );
  };

  onSuccessModalDismissed = (val: ShouldReUseSource) => () => {
    const { sourceId, submittedSourceId } = this.state;
    this.setState({ submittedSourceId: undefined });

    if (
      !sourceId &&
      submittedSourceId &&
      val === ShouldReUseSource.RE_USE_SOURCE
    ) {
      this.props.history.push(makeNewQuoteURL(submittedSourceId));
    }
  };
}

export default NewQuote;
