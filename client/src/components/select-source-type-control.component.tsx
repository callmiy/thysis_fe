import Select from "react-select";
import * as React from "react";

import { FormValuesProps } from "./new-source-modal.component";
import { SourceTypeFragFragment } from "../graphql/gen.types";
import { SourceTypeQueryComponent } from "../graphql/ops.types";
import SOURCE_TYPE_QUERY from "../graphql/source-types.query";

type SourceTypes = SourceTypeFragFragment[];

interface SourceTypeControlProps extends FormValuesProps {
  selectError: boolean;
}

export default class SourceTypeControl extends React.PureComponent<
  SourceTypeControlProps
> {
  render() {
    const {
      field: { name, value },
      selectError
    } = this.props;

    return (
      <SourceTypeQueryComponent query={SOURCE_TYPE_QUERY}>
        {({ data }) => {
          let sourceTypes = [] as SourceTypes;

          if (data) {
            sourceTypes = data.sourceTypes as SourceTypes;
          }

          return (
            <Select
              className={`${selectError ? "error" : ""}`}
              id={name}
              name={name}
              placeholder="Select source type"
              options={sourceTypes}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              value={value}
              labelKey="name"
              valueKey="id"
            />
          );
        }}
      </SourceTypeQueryComponent>
    );
  }

  handleChange = (value: SourceTypes) => {
    this.props.form.setFieldValue(this.props.field.name, value);
  };

  handleBlur = () => {
    this.props.form.setFieldTouched(this.props.field.name, true);
  };
}
