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
import { graphql, compose } from "react-apollo";
import Select from "react-select";
import "react-select/dist/react-select.css";
import isEmpty from "lodash/isEmpty";
import update from "immutability-helper";

import {
  TagFragmentFragment,
  SourceTypeFragmentFragment,
  SourceTypesQuery,
  TagsMinimalQuery
} from "../graphql/gen.types";
import SOURCE_TYPES_QUERY from "../graphql/source-types.query";
import TAGS_QUERY from "../graphql/tags-minimal.query";
import TagControl from "./new-quote-form-tag-control.component";
import { SimpleCss } from "../constants";

jss.setup(preset());

const styles = {
  quoteTextControl: {
    width: "100%",
    margin: "10px 0",
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
  sourceType: SourceTypeFragmentFragment | null;
  quote: string;
}

export type FormValuesProps = FieldProps<FormValues>;

type NewQuoteFormProps = {} & SourceTypesQuery &
  TagsMinimalQuery &
  GraphqlQueryControls;

const sourceTypesGraphQl = graphql<{}, SourceTypesQuery, {}, NewQuoteFormProps>(
  SOURCE_TYPES_QUERY,
  {
    props: (props, ownProps: NewQuoteFormProps) => {
      return { ...ownProps, ...props.data };
    }
  }
);

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

const NewQuoteForm = compose(sourceTypesGraphQl, tagsGraphQl)(
  class extends React.PureComponent<NewQuoteFormProps, NewQuoteFormState> {
    state: NewQuoteFormState = {
      initialFormValues: {
        tags: [],
        sourceType: null,
        quote: ""
      }
    };

    constructor(props: NewQuoteFormProps) {
      super(props);
      this.renderForm = this.renderForm.bind(this);
      this.renderTagControl = this.renderTagControl.bind(this);
      this.renderQuoteControl = this.renderQuoteControl.bind(this);
      this.renderSourceTypeControl = this.renderSourceTypeControl.bind(this);
      this.handleSourceTypeSelected = this.handleSourceTypeSelected.bind(this);
      this.validate = this.validate.bind(this);
    }

    componentWillReceiveProps(
      current: NewQuoteFormProps,
      prev: NewQuoteFormProps
    ) {
      if (current.sourceTypes && current.sourceTypes !== prev.sourceTypes) {
        const sourceType = current.sourceTypes.find(
          s => (s ? s.name === "Journal" : false)
        ) as SourceTypeFragmentFragment;

        this.setState(state =>
          update(state, {
            initialFormValues: { sourceType: { $set: sourceType } }
          })
        );
      }
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
      } else if (!values.sourceType) {
        errors.sourceType = "Select a source type";
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
          <Field name="quote" render={this.renderQuoteControl} />
          <Field name="sourceType" render={this.renderSourceTypeControl} />

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
          initialFormValues: { sourceType: { $set: values.sourceType } }
        })
      );

      formikBag.resetForm();
    };

    renderTagControl = (formProps: FieldProps<FormValues>) => {
      const tags = this.props.tags as TagFragmentFragment[];

      return <TagControl {...formProps} tags={tags || []} />;
    };

    renderQuoteControl = ({ field, form }: FieldProps<FormValues>) => {
      const { name } = field;

      return (
        <div>
          <textarea
            className={`${classes.quoteTextControl}`}
            {...field}
            placeholder="Quote text"
          />

          {form.touched[name] && form.errors[name] && form.errors[name]}
        </div>
      );
    };

    renderSourceTypeControl = ({ field, form }: FieldProps<FormValues>) => {
      const sourceTypes = this.props
        .sourceTypes as SourceTypeFragmentFragment[];
      const { name } = field;
      const sourceType = form.values.sourceType as SourceTypeFragmentFragment;

      return (
        <div>
          <Select
            {...field}
            value={sourceType}
            onChange={this.handleSourceTypeSelected({ form, field })}
            labelKey="name"
            valueKey="id"
            onBlur={this.handleSourceTypeBlurred({ form, field })}
            options={sourceTypes || []}
          />

          {form.touched[name] && form.errors[name] && form.errors[name]}
        </div>
      );
    };

    handleSourceTypeSelected = ({ form, field }: FieldProps<FormValues>) => (
      selectedSourceType: SourceTypeFragmentFragment
    ) => {
      form.setFieldValue(field.name, selectedSourceType);
    };

    handleSourceTypeBlurred = ({
      form,
      field
    }: FieldProps<FormValues>) => () => {
      form.setFieldTouched(field.name, true);
    };
  }
);

// tslint:disable-next-line:max-classes-per-file
export default class NewQuote extends React.Component<{}> {
  render() {
    return <NewQuoteForm />;
  }
}
