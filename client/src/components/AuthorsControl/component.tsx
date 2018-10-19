import Select from "react-select";
import React from "react";

import { AuthorFrag } from "../../graphql/gen.types";
import { GetAllAuthorsQueryComponent } from "../../graphql/ops.types";
import AUTHORS_QUERY from "../../graphql/authors.query";
import { authorFullName } from "../../graphql/utils";
import { AuthorWithFullName } from "../../graphql/utils";

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
          let authors = [] as AuthorWithFullName[];

          if (data && data.authors) {
            authors = data.authors.map((a: AuthorWithFullName) => {
              // a.fullName = authorFullName(a);
              return { ...a, fullName: authorFullName(a) };
            }) as AuthorWithFullName[];
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
              labelKey="fullName"
              valueKey="id"
            />
          );
        }}
      </GetAllAuthorsQueryComponent>
    );
  }
}

export default AuthorsControl;
