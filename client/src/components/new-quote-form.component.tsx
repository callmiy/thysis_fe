import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { Formik, FormikProps, Field, FieldProps, FormikErrors } from "formik";
import { GraphqlQueryControls } from "react-apollo";
import { graphql, compose } from "react-apollo";
import isEmpty from "lodash/isEmpty";
import { Button, Form, TextArea, Message } from "semantic-ui-react";
import moment from "moment";
import update from "immutability-helper";
import { Mutation } from "react-apollo";

import {
  TagFragFragment,
  TagsMinimalQuery,
  SourceMiniFragFragment,
  CreateQuoteInput,
  SourceMiniQuery
} from "../graphql/gen.types";
import TAGS_QUERY from "../graphql/tags-mini.query";
import TagControl from "./new-quote-form-tag-control.component";
import SourceControl from "./new-quote-form-source-control.component";
import Date, { DateType } from "./new-quote-date.component";
import { ERROR_COLOR } from "../constants";
import Page, { PageType } from "./new-quote-page-start-end.component";
import VolumeIssue, {
  VolumeIssueType
} from "./new-quote-volume-issue.component";
import QUOTE_MUTATION from "../graphql/quote.mutation";
import { CreateQueryFn } from "../graphql/ops.types";
import SOURCE_MINI_QUERY from "../graphql/source-mini.query";

jss.setup(preset());

const styles = {
  newQuoteRoot: {
    margin: "0 10px"
  },

  errorBorder: {
    borderColor: ERROR_COLOR
  },

  submitReset: {
    margin: "30px 0",
    display: "flex",
    justifyContent: "center"
  },

  reset: {
    marginRight: "50px"
  }
  // tslint:disable-next-line:no-any
} as any;

const { classes } = jss.createStyleSheet(styles).attach();

interface FormValues {
  tags: TagFragFragment[] | null;
  source: SourceMiniFragFragment | null;
  quote: string;
  date: DateType | null;
  page: PageType | null;
  volumeIssue: VolumeIssueType | null;
  extras: string;
}

export type FormValuesProps = FieldProps<FormValues>;

type NewQuoteFormProps = {} & TagsMinimalQuery &
  SourceMiniQuery &
  GraphqlQueryControls;

const tagsGraphQl = graphql<{}, TagsMinimalQuery, {}, NewQuoteFormProps>(
  TAGS_QUERY,
  {
    props: (props, ownProps: NewQuoteFormProps) => {
      return { ...ownProps, ...props.data };
    }
  }
);

const sourcesGraphQl = graphql<{}, SourceMiniQuery, {}, NewQuoteFormProps>(
  SOURCE_MINI_QUERY,
  {
    props: (props, ownProps: NewQuoteFormProps) => {
      return { ...ownProps, ...props.data };
    }
  }
);

interface NewQuoteFormState {
  initialFormValues: FormValues;
  formOutputs: CreateQuoteInput;
}

class NewQuoteForm extends React.Component<
  NewQuoteFormProps,
  NewQuoteFormState
> {
  state: NewQuoteFormState = {
    initialFormValues: {
      tags: null,
      source: null,
      quote: "",
      date: null,
      page: null,
      volumeIssue: null,
      extras: ""
    },
    formOutputs: {
      date: "",
      sourceId: "",
      tags: [],
      text: ""
    }
  };

  constructor(props: NewQuoteFormProps) {
    super(props);

    [
      "renderForm",
      "renderTagControl",
      "renderQuoteControl",
      "renderSourceControl",
      "validate",
      "renderDateControl",
      "validatedate",
      "validatetags",
      "validatesource",
      "validatequote",
      "validatepage",
      "renderPageControl",
      "renderVolumeIssueControl",
      "handleDateChange",
      "handlePageChange",
      "handleVolumeIssueChange",
      "handleDateBlur",
      "handlePageBlur",
      "handleVolumeIssueBlur",
      "renderExtrasControl",
      "reShapeSources"
    ].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  render() {
    return (
      <div className={classes.newQuoteRoot}>
        <h2>New Quote</h2>

        <Mutation
          mutation={QUOTE_MUTATION}
          variables={{ quote: this.state.formOutputs }}
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
    );
  }

  validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};

    for (const key of Object.keys(values)) {
      const error = this[`validate${key}`](values[key]);

      if (error) {
        errors[key] = error;
        return errors;
      }
    }

    return errors;
  };

  validatequote = (quote: string | null) => {
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

  validateextras = (extras: string | null) => {
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

  validatesource = (source: SourceMiniFragFragment | null) => {
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

  validatetags = (tags: TagFragFragment[] | null) => {
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

  validatedate = (date: DateType | null) => {
    const error = "Enter a valid date";

    if (!date) {
      return error;
    }

    const keys = Object.keys(date);

    if (keys.length !== 3) {
      return error;
    }

    const year = date.year as number;

    if (!year) {
      return error;
    }

    const month = date.month as number;

    if (!month) {
      return error;
    }

    const day = date.day as number;

    if (!day) {
      return error;
    }

    const datec = moment({ year, month: month - 1, day });
    const isValid = datec.isValid();

    this.setState(prev =>
      update(prev, {
        formOutputs: {
          date: {
            $set: isValid ? datec.format("YYYY-MM-D") : undefined
          }
        }
      })
    );

    return isValid ? "" : error;
  };

  validatepage = (page: PageType | null) => {
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

  validatevolumeIssue = (volumeIssue: VolumeIssueType | null) => {
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

  renderForm = ({
    handleReset,
    dirty,
    isSubmitting,
    errors,
    handleSubmit
  }: FormikProps<FormValues>) => {
    const dirtyOrSubmitting = !dirty || isSubmitting;
    const disableSubmit = dirtyOrSubmitting || !isEmpty(errors);

    return (
      <Form onSubmit={handleSubmit}>
        <Field name="tags" render={this.renderTagControl} />

        <Field name="source" render={this.renderSourceControl} />

        <Field name="quote" render={this.renderQuoteControl} />

        <Field name="date" render={this.renderDateControl} />
        <Field name="page" render={this.renderPageControl} />
        <Field name="volumeIssue" render={this.renderVolumeIssueControl} />
        <Field name="extras" render={this.renderExtrasControl} />

        <Form.Group inline={true} className={`${classes.submitReset}`}>
          <Form.Field
            control={Button}
            type="button"
            className={`${classes.reset}`}
            onClick={handleReset}
            disabled={dirtyOrSubmitting}
          >
            Reset
          </Form.Field>

          <Form.Field control={Button} type="submit" disabled={disableSubmit}>
            Submit
          </Form.Field>
        </Form.Group>
      </Form>
    );
  };

  submit = (createQuote: CreateQueryFn) => async (
    values: FormValues,
    formikBag: FormikProps<FormValues>
  ) => {
    formikBag.setSubmitting(true);

    try {
      await createQuote();
      formikBag.resetForm();
    } catch (error) {
      formikBag.setSubmitting(false);
    }
  };

  renderTagControl = (formProps: FieldProps<FormValues>) => {
    const {
      field: { name },
      form
    } = formProps;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];
    const tags = this.props.tags as TagFragFragment[];

    return (
      <Form.Field
        control={TagControl}
        label="Select at least one tag"
        error={booleanError}
        selectError={booleanError}
        tags={tags || []}
        {...formProps}
      >
        {booleanError && touched && <Message error={true} header={error} />}
      </Form.Field>
    );
  };

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
        onChange={this.handleDateChange(name, formik)}
        onBlur={this.handleDateBlur(name, formik)}
        value={field.value}
      />
    );
  };

  handleDateChange = (name: string, { form }: FieldProps<FormValues>) => (
    date: DateType
  ) => form.setFieldValue(name, date);

  handleDateBlur = (name: string, { form }: FieldProps<FormValues>) => () =>
    form.setFieldTouched(name, true);

  renderPageControl = (formik: FieldProps<FormValues>) => {
    const { field, form } = formik;
    const { name } = field;
    const error = form.errors[name];
    const booleanError = !!error;

    return (
      <Page
        className={`${booleanError ? classes.errorBorder : ""}`}
        onChange={this.handlePageChange(name, formik)}
        onBlur={this.handlePageBlur(name, formik)}
        value={field.value}
      />
    );
  };

  handlePageChange = (name: string, { form }: FieldProps<FormValues>) => (
    page: PageType
  ) => form.setFieldValue(name, page);

  handlePageBlur = (name: string, { form }: FieldProps<FormValues>) => () =>
    form.setFieldTouched(name, true);

  renderVolumeIssueControl = (formik: FieldProps<FormValues>) => {
    const { field, form } = formik;
    const { name } = field;
    const error = form.errors[name];
    const booleanError = !!error;

    return (
      <VolumeIssue
        className={`${booleanError ? classes.errorBorder : ""}`}
        onChange={this.handleVolumeIssueChange(name, formik)}
        onBlur={this.handleVolumeIssueBlur(name, formik)}
        value={field.value}
      />
    );
  };

  handleVolumeIssueChange = (
    name: string,
    { form }: FieldProps<FormValues>
  ) => (volumeIssue: VolumeIssueType) => form.setFieldValue(name, volumeIssue);

  handleVolumeIssueBlur = (
    name: string,
    { form }: FieldProps<FormValues>
  ) => () => form.setFieldTouched(name, true);

  renderSourceControl = (formProps: FieldProps<FormValues>) => {
    const {
      field: { name },
      form
    } = formProps;
    const error = form.errors[name];
    const booleanError = !!error;
    const touched = form.touched[name];
    let sources = this.props.sources as SourceMiniFragFragment[];
    sources = this.reShapeSources(sources);

    return (
      <Form.Field
        control={SourceControl}
        label="Select source"
        error={booleanError}
        selectError={booleanError}
        sources={sources}
        {...formProps}
      >
        {booleanError && touched && <Message error={true} header={error} />}
      </Form.Field>
    );
  };

  reShapeSources = (
    sources: null | SourceMiniFragFragment[]
  ): SourceMiniFragFragment[] => {
    if (!sources) {
      return [];
    }

    return sources.map(s => {
      return {
        ...s,
        display: `${s.display} | ${s.sourceType.name}`
      };
    });
  };
}

export default compose(tagsGraphQl, sourcesGraphQl)(NewQuoteForm);
