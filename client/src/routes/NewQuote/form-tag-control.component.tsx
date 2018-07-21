import Select from "react-select";
import * as React from "react";

import { TagFrag } from "../../graphql/gen.types";

interface TagControlProps {
  tags: TagFrag[];
  selectError: boolean;
  handleChange: (value: TagFrag[]) => void;
  handleBlur: () => void;
  name: string;
  value: TagFrag;
}

export default class TagControl extends React.Component<TagControlProps> {
  render() {
    const { name, value, selectError } = this.props;

    return (
      <Select
        className={`${selectError ? "error" : ""}`}
        id={name}
        name={name}
        placeholder="Select tags"
        options={this.props.tags}
        multi={true}
        onChange={this.props.handleChange}
        onBlur={this.props.handleBlur}
        value={value}
        labelKey="text"
        valueKey="id"
      />
    );
  }
}
