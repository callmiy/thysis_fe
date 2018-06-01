import Select from "react-select";
import * as React from "react";

import { FormValuesProps } from "./new-quote.component";
import { TagFragmentFragment } from "../graphql/gen.types";

type Tags = TagFragmentFragment[];

type TagControlProps = {
  tags: Tags;
} & FormValuesProps;

export default class TagControl extends React.Component<TagControlProps> {
  render() {
    const {
      field: { name, value },
      form
    } = this.props;
    const error = form.errors[name];
    const touched = form.touched[name];

    return (
      <div>
        <label htmlFor={name}>Tags (select at least one)</label>
        <Select
          id={name}
          name={name}
          options={this.props.tags}
          multi={true}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={value}
          labelKey="text"
          valueKey="id"
        />

        {!!error &&
          touched && (
            <div style={{ color: "red", marginTop: ".5rem" }}>{error}</div>
          )}
      </div>
    );
  }

  handleChange = (value: Tags) => {
    this.props.form.setFieldValue(this.props.field.name, value);
  };

  handleBlur = () => {
    this.props.form.setFieldTouched(this.props.field.name, true);
  };
}
