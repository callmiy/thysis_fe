import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import {
  Formik,
  FormikProps,
  Form,
  Field,
  FieldProps,
  FormikErrors
} from "formik";
import { GraphqlQueryControls } from "react-apollo";
import { graphql } from "react-apollo";
import "react-select/dist/react-select.css";
import isEmpty from "lodash/isEmpty";
import update from "immutability-helper";

import {
  TagFragFragment,
  TagsMinimalQuery,
  SourceMiniFragFragment
  // createQuoteMutation,
  // createQuoteMutationVariables
} from "../graphql/gen.types";
import TAGS_QUERY from "../graphql/tags-mini.query";
// import QUOTE_MUTATION from "../graphql/quote.mutation";
import TagControl from "./new-quote-form-tag-control.component";
import { SimpleCss } from "../constants";
import SourceControl from "./new-quote-form-source-control.component";

jss.setup(preset());

const styles = {
  quoteContainer: {
    display: "flex"
  },

  quoteTextControlContainer: {
    width: "30%"
  },

  quoteTextControl: {
    width: "100%",
    margin: "20px 0",
    minHeight: "150px"
  },

  submitReset: {
    margin: "20px 0",
    display: "flex",
    justifyContent: "center"
  },

  submit: {},

  reset: {
    marginRight: "50px"
  }
} as SimpleCss;

const { classes } = jss.createStyleSheet(styles).attach();

interface FormValues {
  tags: string[];
  quote: string;
  source: SourceMiniFragFragment | null;
}

export type FormValuesProps = FieldProps<FormValues>;

type NewQuoteFormProps = {} & TagsMinimalQuery & GraphqlQueryControls;

const tagsGraphQl = graphql<{}, TagsMinimalQuery, {}, NewQuoteFormProps>(
  TAGS_QUERY,
  {
    props: (props, ownProps: NewQuoteFormProps) => {
      return { ...ownProps, ...props.data };
    }
  }
);

interface NewQuoteFormState {
  initialFormValues: FormValues;
}

const NewQuoteForm = tagsGraphQl(
  class extends React.PureComponent<NewQuoteFormProps, NewQuoteFormState> {
    state: NewQuoteFormState = {
      initialFormValues: {
        tags: [],
        quote: "",
        source: null
      }
    };

    constructor(props: NewQuoteFormProps) {
      super(props);
      this.renderForm = this.renderForm.bind(this);
      this.renderTagControl = this.renderTagControl.bind(this);
      this.renderQuoteControl = this.renderQuoteControl.bind(this);
      this.renderSourceControl = this.renderSourceControl.bind(this);
      this.validate = this.validate.bind(this);
    }

    render() {
      return (
        <div>
          <h1>New Quote</h1>
          <Formik
            initialValues={this.state.initialFormValues}
            enableReinitialize={true}
            onSubmit={this.submit}
            render={this.renderForm}
            validate={this.validate}
          />
        </div>
      );
    }

    validate = (values: FormValues) => {
      const errors: FormikErrors<FormValues> = {};

      if (!values.tags.length) {
        errors.tags = "Select at least one tag";
      } else if (!values.quote) {
        errors.quote = "Enter a quote";
      } else if (!values.source) {
        errors.source = "Select a source";
      }

      return errors;
    };

    renderForm = ({
      handleReset,
      dirty,
      isSubmitting,
      errors
    }: FormikProps<FormValues>) => {
      const dirtyOrSubmitting = !dirty || isSubmitting;
      const disableSubmit = dirtyOrSubmitting || !isEmpty(errors);

      return (
        <Form>
          <Field name="tags" render={this.renderTagControl} />

          <div className={`${classes.quoteContainer}`}>
            <Field name="quote" render={this.renderQuoteControl} />
          </div>

          <Field name="source" render={this.renderSourceControl} />

          <div className={`${classes.submitReset}`}>
            <button
              type="button"
              className={`${classes.reset}`}
              onClick={handleReset}
              disabled={dirtyOrSubmitting}
            >
              Reset
            </button>

            <button type="submit" disabled={disableSubmit}>
              Submit
            </button>
          </div>
        </Form>
      );
    };

    submit = (values: FormValues, formikBag: FormikProps<FormValues>) => {
      // tslint:disable-next-line:no-console
      console.log(
        `



        values`,
        values,
        `



        `
      );

      this.setState(state =>
        update(state, {
          initialFormValues: { source: { $set: values.source } }
        })
      );

      formikBag.resetForm();
    };

    renderTagControl = (formProps: FieldProps<FormValues>) => {
      const tags = this.props.tags as TagFragFragment[];

      return <TagControl {...formProps} tags={tags || []} />;
    };

    renderQuoteControl = ({ field, form }: FieldProps<FormValues>) => {
      const { name } = field;

      return (
        <div className={`${classes.quoteTextControlContainer}`}>
          <textarea
            className={`${classes.quoteTextControl}`}
            {...field}
            placeholder="Quote text"
          />

          {form.touched[name] && form.errors[name] && form.errors[name]}
        </div>
      );
    };

    renderSourceControl = (formProps: FieldProps<FormValues>) => {
      return <SourceControl {...formProps} />;
    };
  }
);

// tslint:disable-next-line:max-classes-per-file
export default class NewQuote extends React.Component<{}> {
  render() {
    return <NewQuoteForm />;
  }
}
