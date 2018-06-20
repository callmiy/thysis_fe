import Select from "react-select";
import * as React from "react";

import { AuthorFragFragment } from "../../graphql/gen.types";
import { GetAllAuthorsQueryComponent } from "../../graphql/ops.types";
import AUTHORS_QUERY from "../../graphql/authors.query";

interface AuthorsControlProps {
  selectError: boolean;
  authors: AuthorFragFragment[];
  handleChange: (value: AuthorFragFragment[]) => void;
  handleBlur: () => void;
  name: string;
  value: AuthorFragFragment;
}

export class AuthorsControl extends React.Component<AuthorsControlProps> {
  render() {
    const { name, value, selectError } = this.props;
    return (
      <GetAllAuthorsQueryComponent query={AUTHORS_QUERY}>
        {({ data }) => {
          let authors = [] as AuthorFragFragment[];

          if (data) {
            authors = data.authors as AuthorFragFragment[];
          }

          return (
            <Select
              className={`${selectError ? "error" : ""}`}
              id={name}
              name={name}
              placeholder="Select authors"
              options={authors}
              multi={true}
              onChange={this.props.handleChange}
              onBlur={this.props.handleBlur}
              value={value}
              labelKey="name"
              valueKey="id"
            />
          );
        }}
      </GetAllAuthorsQueryComponent>
    );
  }
}

export default AuthorsControl;
