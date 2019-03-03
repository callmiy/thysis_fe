import Select from "react-select";
import React from "react";

import { GetAllAuthorsQueryComponent } from "../../graphql/ops.types";
import AUTHORS_QUERY from "../../graphql/authors.query";
import { authorFullName } from "../../graphql/utils";
import { AuthorWithFullName } from "../../graphql/utils";
import { Props } from "./authors-control";
import Loading from "../Loading";

export class AuthorsControl extends React.Component<Props> {
  render() {
    const {
      name,
      value,
      selectError,
      handleChange,
      handleBlur,
      loading,
      currentProject
    } = this.props;

    if (loading || !currentProject) {
      return <Loading />;
    }

    return (
      <GetAllAuthorsQueryComponent
        query={AUTHORS_QUERY}
        variables={{
          author: {
            projectId: currentProject.id
          }
        }}
      >
        {({ data }) => {
          const authors = ((data && data.authors) || []).reduce(
            (acc, a) => {
              if (a) {
                acc.push({ ...a, fullName: authorFullName(a) });
              }
              return acc;
            },
            [] as AuthorWithFullName[]
          );

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
