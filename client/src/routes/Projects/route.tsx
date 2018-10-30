import React from "react";
import { Input } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import update from "immutability-helper";

import "./projects.css";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { Props, State, initialState } from "./projects";
import { SemanticOnInputChangeFunc } from "../../utils";
import { ProjectFragment } from "src/graphql/gen.types";
import { ROOT_URL } from "../util";
import { format as dateFormat } from "date-fns";

export class SelectProject extends React.Component<Props, State> {
  state: State = initialState;

  render() {
    const { form } = this.state;

    const formError = this.formError();

    return (
      <div className="select-project">
        <Header title="Select Project" />

        <div className="main">
          <Form className="form">
            <div className="control">
              <Form.Field
                control={Input}
                className="input"
                name="title"
                autoComplete="off"
                placeholder="Project title"
                autoFocus={true}
                onChange={this.onProjectInputChange}
                value={this.state.form.title}
                error={formError}
              />

              {form.title && !formError ? (
                <Icon name="checkmark" color="green" onClick={this.submit} />
              ) : (
                undefined
              )}

              {form.title ? (
                <Icon name="times" color="red" onClick={this.resetForm} />
              ) : (
                undefined
              )}
            </div>

            {formError && <div className="message">Too short</div>}
          </Form>

          {this.renderProjects()}
        </div>
      </div>
    );
  }

  private renderProjects = () => {
    const { projects, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (!projects || !projects.length) {
      return <div>You currently have no project. You may create one now.</div>;
    }

    return (
      <div>
        <div>Your Projects</div>
        <List divided={true} relaxed={true}>
          {projects.map(this.renderProject)}
        </List>
      </div>
    );
  };

  private renderProject = (project: ProjectFragment) => (
    <List.Item key={project.projectId}>
      <List.Content
        className="project-row"
        onClick={this.projectSelected(project)}
      >
        <List.Header className="project-row__header">
          {project.title}
        </List.Header>
        <List.Description className="project-row__desc">
          Created: &nbsp; &nbsp;{" "}
          {dateFormat(project.insertedAt, "eeee, M/MMM/yyyy HH:mm a")}
        </List.Description>
      </List.Content>
    </List.Item>
  );

  private projectSelected = (currentProject: ProjectFragment) => async () => {
    await this.props.updateLocalProject({ variables: { currentProject } });
    this.props.history.push(ROOT_URL);
  };

  private submit = async () => {
    const result = await this.props.createProject(this.state.form.title);
    if (!result) {
      return;
    }

    const { data } = result;

    if (!data) {
      return;
    }

    const { project } = data;

    if (!project) {
      return;
    }

    this.projectSelected(project)();
  };

  private onProjectInputChange: SemanticOnInputChangeFunc = (e, { value }) => {
    this.setState(s =>
      update(s, {
        form: {
          title: {
            $set: value
          }
        }
      })
    );
  };

  private resetForm = () =>
    this.setState(s =>
      update(s, {
        form: {
          title: {
            $set: ""
          }
        }
      })
    );

  private formError = () => {
    const {
      form: { title }
    } = this.state;
    return title.length > 0 && title.length < 2;
  };
}

export default SelectProject;
