import Select, { OnChangeHandler } from "react-select";
import React from "react";

import { SourceTypeFrag } from "../../graphql/gen.types";
import { SourceTypeQueryComponent } from "../../graphql/ops.types";
import SOURCE_TYPE_QUERY from "../../graphql/source-types.query";

interface Props {
  selectError: boolean;
  handleChange: OnChangeHandler<SourceTypeFrag[]>;
  handleBlur: () => void;
  name: string;
  value: SourceTypeFrag[];
}

export class SourceTypeControlComponent extends React.Component<Props> {
  render() {
    const { name, value, selectError, handleChange, handleBlur } = this.props;

    return (
      <SourceTypeQueryComponent query={SOURCE_TYPE_QUERY}>
        {({ data }) => {
          let sourceTypes = [] as SourceTypeFrag[];

          if (data) {
            sourceTypes = data.sourceTypes as SourceTypeFrag[];
          }

          return (
            <Select
              className={`${selectError ? "error" : ""}`}
              id={name}
              name={name}
              placeholder="Select source type"
              options={sourceTypes}
              onChange={handleChange}
              onBlur={handleBlur}
              value={value}
              labelKey="name"
              valueKey="id"
            />
          );
        }}
      </SourceTypeQueryComponent>
    );
  }
}

export default SourceTypeControlComponent;
