import Select, { OnChangeHandler } from "react-select";
import * as React from "react";

import { SourceFullFrag } from "../../graphql/gen.types";
import { sourceDisplay } from "../../graphql/utils";

interface Props {
  selectError: boolean;
  sources: SourceFullFrag[];
  handleChange: OnChangeHandler<SourceFullFrag[]>;
  handleBlur: () => void;
  name: string;
  value: SourceFullFrag;
}

export default class SourceControl extends React.Component<Props> {
  render() {
    const { name, value, selectError, sources } = this.props;

    return (
      <Select
        className={`${selectError ? "error" : ""}`}
        id={name}
        name={name}
        placeholder="Select source"
        options={sources.map(s => ({ ...s, display: sourceDisplay(s) }))}
        onChange={this.props.handleChange}
        onBlur={this.props.handleBlur}
        value={value}
        labelKey="display"
        valueKey="id"
      />
    );
  }
}
