import Select from "react-select";
import React from "react";

import { AuthorFrag } from "../../graphql/gen.types";
import { GetAllAuthorsQueryComponent } from "../../graphql/ops.types";
import AUTHORS_QUERY from "../../graphql/authors.query";

interface AuthorsControlProps {
  selectError: boolean;
  handleChange: (value: AuthorFrag[]) => void;
  handleBlur: () => void;
  name: string;
  value: AuthorFrag[];
}

export class AuthorsControl extends React.Component<AuthorsControlProps> {
  render() {
    const { name, value, selectError, handleChange, handleBlur } = this.props;
    return (
      <GetAllAuthorsQueryComponent query={AUTHORS_QUERY}>
        {({ data }) => {
          let authors = [] as AuthorFrag[];

          if (data && data.authors) {
            authors = data.authors as AuthorFrag[];
          }

          return (
            <Select
              className={`${selectError ? "error" : ""}`}
              id={name}
              name={name}
              placeholder="Select authors"
              options={authors}
              multi={true}
              autoBlur={true}
              onChange={handleChange}
              onBlur={handleBlur}
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
