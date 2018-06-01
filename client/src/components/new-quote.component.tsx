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

const initialFormValues: FormValues = {
  tags: [],
  sourceType: null,
  quote: ""
};

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

const NewQuoteForm = compose(sourceTypesGraphQl, tagsGraphQl)(
  class extends React.PureComponent<NewQuoteFormProps> {
    constructor(props: NewQuoteFormProps) {
      super(props);
      this.renderForm = this.renderForm.bind(this);
      this.renderTagControl = this.renderTagControl.bind(this);
      this.renderQuoteControl = this.renderQuoteControl.bind(this);
      this.renderSourceTypeControl = this.renderSourceTypeControl.bind(this);
      this.handleSourceTypeSelected = this.handleSourceTypeSelected.bind(this);
      this.validate = this.validate.bind(this);
    }

    render() {
      return (
        <div>
          <h1>New Quote</h1>
          <Formik
            initialValues={initialFormValues}
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
      isSubmitting
    }: FormikProps<FormValues>) => {
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
              disabled={!dirty || isSubmitting}
            >
              Reset
            </button>

            <button type="submit" disabled={!dirty || isSubmitting}>
              Submit
            </button>
          </div>
        </Form>
      );
    };

    submit = (values: FormValues) => {
      // tslint:disable-next-line:no-console
      console.log(
        `



        values`,
        values,
        `



        `
      );
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
      const { loading } = this.props;
      const sourceTypes = this.props
        .sourceTypes as SourceTypeFragmentFragment[];

      if (loading || !sourceTypes) {
        return <div>loading..</div>;
      }

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
            options={sourceTypes}
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
