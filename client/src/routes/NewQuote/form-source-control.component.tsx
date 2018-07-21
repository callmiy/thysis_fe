import Select from "react-select";
import * as React from "react";

import { SourceFrag } from "../../graphql/gen.types";

interface SourceControlProps {
  selectError: boolean;
  sources: SourceFrag[];
  handleChange: (value: SourceFrag[]) => void;
  handleBlur: () => void;
  name: string;
  value: SourceFrag;
}

export default class SourceControl extends React.Component<SourceControlProps> {
  render() {
    const { name, value, selectError, sources } = this.props;
    return (
      <Select
        className={`${selectError ? "error" : ""}`}
        id={name}
        name={name}
        placeholder="Select source"
        options={sources}
        onChange={this.props.handleChange}
        onBlur={this.props.handleBlur}
        value={value}
        labelKey="display"
        valueKey="id"
      />
    );
  }
}
