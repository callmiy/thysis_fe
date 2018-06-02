import Select from "react-select";
import * as React from "react";

import { FormValuesProps } from "./new-quote.component";
import { SourceMiniFragFragment, SourceMiniQuery } from "../graphql/gen.types";
import { SourceMiniRunQuery } from "../graphql/ops.types";
import SOURCE_MINI_QUERY from "../graphql/source-mini.query";

type Sources = SourceMiniFragFragment[];

type SourceControlProps = FormValuesProps & { selectError: boolean };

export default class SourceControl extends React.Component<SourceControlProps> {
  constructor(props: SourceControlProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.reShapeSources = this.reShapeSources.bind(this);
  }

  render() {
    const {
      field: { name, value },
      selectError
    } = this.props;
    return (
      <SourceMiniRunQuery query={SOURCE_MINI_QUERY}>
        {({ data }) => {
          const sources = this.reShapeSources(data) as Sources;

          return (
            <Select
              className={`${selectError ? "error" : ""}`}
              id={name}
              name={name}
              placeholder="Select source"
              options={sources}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={value}
              labelKey="display"
              valueKey="id"
            />
          );
        }}
      </SourceMiniRunQuery>
    );
  }

  reShapeSources = (data: SourceMiniQuery | undefined) => {
    if (!data || !data.sources) {
      return [];
    }

    const sources = data.sources as Sources;

    return sources.map(s => {
      return {
        ...s,
        display: `${s.display} | ${s.sourceType.name}`
      };
    });
  };

  handleChange = (value: Sources) => {
    this.props.form.setFieldValue(this.props.field.name, value);
  };

  handleBlur = () => {
    this.props.form.setFieldTouched(this.props.field.name, true);
  };
}
