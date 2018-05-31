import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { Formik, FormikProps, Form, Field, FieldProps } from "formik";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import { withStyles, Theme, WithStyles } from "@material-ui/core/styles";

import { TagContextValue, TagContextConsumer } from "../routes/home.route";
import { TagFragmentFragment } from "../graphql/gen.types";
import { FLEX_WRAP_WRAP } from "../constants";

jss.setup(preset());

const styles = ({ palette, spacing }: Theme) => ({
  root: {
    display: "flex",
    flexWrap: FLEX_WRAP_WRAP,
    padding: spacing.unit / 2,
    minHeight: "50px"
  },

  chip: {
    margin: spacing.unit / 2
  },

  quoteText: {
    minHeight: "150px",
    width: "100%",
    margin: "10px 5px"
  }
});

type PropsWithStyles = WithStyles<keyof ReturnType<typeof styles>>;

interface FormValues {
  tags: string[];
}

interface NewQuoteFormState {
  tagContext: TagContextValue | null;
}

const NewQuoteForm = withStyles(styles)<{}>(
  class extends React.PureComponent<PropsWithStyles, NewQuoteFormState> {
    state: NewQuoteFormState = {
      tagContext: null
    };

    constructor(props: PropsWithStyles) {
      super(props);
      this.renderForm = this.renderForm.bind(this);
      this.renderTagControl = this.renderTagControl.bind(this);
      this.renderChip = this.renderChip.bind(this);
      this.removeTag = this.removeTag.bind(this);
      this.renderQuoteControl = this.renderQuoteControl.bind(this);
    }

    render() {
      return (
        <TagContextConsumer>
          {(value: TagContextValue) => {
            this.setState({ tagContext: value });

            return (
              <div>
                <h1>New Quote</h1>
                <Formik
                  initialValues={{ tags: [] }}
                  onSubmit={this.submit}
                  render={this.renderForm}
                />
              </div>
            );
          }}
        </TagContextConsumer>
      );
    }

    submit = (values: FormValues) => alert(JSON.stringify(values));

    renderTagControl = ({ field, form }: FieldProps<FormValues>) => {
      const tags = this.state.tagContext ? this.state.tagContext.tags : [];

      return (
        <div>
          <Paper className={this.props.classes.root}>
            {tags.map(this.renderChip)}
          </Paper>
          {form.touched.tags && form.errors.tags && form.errors.tags}
        </div>
      );
    };

    renderQuoteControl = ({ field, form }: FieldProps<FormValues>) => {
      return (
        <div>
          <textarea
            className={this.props.classes.quoteText}
            {...field}
            placeholder="Quote text"
          />
          {form.touched.tags && form.errors.tags && form.errors.tags}
        </div>
      );
    };

    renderChip = ({ id, text }: TagFragmentFragment) => (
      <Chip
        key={id}
        label={text}
        onDelete={this.removeTag(id)}
        className={this.props.classes.chip}
      />
    );

    removeTag = (id: string) => () => {
      if (this.state.tagContext) {
        this.state.tagContext.removeTag(id);
      }
    };

    renderForm = (formikBag: FormikProps<FormValues>) => (
      <Form>
        <Field name="tags" render={this.renderTagControl} />
        <Field name="quote" render={this.renderQuoteControl} />
      </Form>
    );
  }
);

// tslint:disable-next-line:max-classes-per-file
export default class NewQuote extends React.Component<{}> {
  render() {
    return <NewQuoteForm />;
  }
}
