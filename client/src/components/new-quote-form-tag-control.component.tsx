import Select from "react-select";
import * as React from "react";

import { FormValuesProps } from "./new-quote.component";
import { TagFragFragment } from "../graphql/gen.types";

type Tags = TagFragFragment[];

interface TagControlProps extends FormValuesProps {
  tags: Tags;
  selectError: boolean;
}

export default class TagControl extends React.Component<TagControlProps> {
  render() {
    const {
      field: { name, value },
      selectError
    } = this.props;

    return (
      <Select
        className={`${selectError ? "error" : ""}`}
        id={name}
        name={name}
        placeholder="Select tags"
        options={this.props.tags}
        multi={true}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        value={value}
        labelKey="text"
        valueKey="id"
      />
    );
  }

  handleChange = (value: Tags) => {
    this.props.form.setFieldValue(this.props.field.name, value);
  };

  handleBlur = () => {
    this.props.form.setFieldTouched(this.props.field.name, true);
  };
}
