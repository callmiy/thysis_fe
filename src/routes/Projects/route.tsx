import React from "react";
import { Input } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Form } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import update from "immutability-helper";
import dateFormat from "date-fns/format";
import parseISO from "date-fns/parseISO";

import "./projects.scss";
import Header from "../../components/Header";
import Loading from "../../components/Loading";
import { Props, State, initialState } from "./projects";
import { SemanticOnInputChangeFunc } from "../../utils";
import { ProjectFragment } from "../../graphql/gen.types";
import { makeNewQuoteURL } from "../util";
import AppSideBar from "../../components/AppSidebar";

export class SelectProject extends React.Component<Props, State> {
  state: State = initialState;

  render() {
    return (
      <AppSideBar>
        <div className="select-project">
          <Header title="Select Project" showSideBarTrigger={true} />

          <div className="main">
            {this.renderForm()}
            {this.renderProjects()}
          </div>
        </div>
      </AppSideBar>
    );
  }

  private renderForm = () => {
    const { loading, error } = this.props;

    if (loading || error) {
      return undefined;
    }

    const { form } = this.state;
    const formError = this.formError();

    return (
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
    );
  };

  private renderProjects = () => {
    const { projects, loading, error } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (error) {
      return (
        <div>
          Unable to load projects
          <div>{error.message}</div>
        </div>
      );
    }

    if (!projects || !projects.length) {
      return (
        <div className="no-project">
          You currently have no project. You may create one now.
        </div>
      );
    }

    return (
      <div>
        <div className="your-projects">
          <span className="label">Projects</span>
        </div>
        <List divided={true} relaxed={true}>
          {projects.map(this.renderProject)}
        </List>
      </div>
    );
  };

  private renderProject = (project: null | ProjectFragment) => {
    if (!project) {
      return undefined;
    }

    return (
      <List.Item key={project.id}>
        <List.Content
          className="project-row"
          onClick={this.projectSelected(project)}
        >
          <List.Header className="project-row__header">
            {project.title}
          </List.Header>
          <List.Description className="project-row__desc">
            Created: &nbsp; &nbsp;
            {dateFormat(
              parseISO(project.insertedAt),
              "eeee, M/MMM/yyyy HH:mm a"
            )}
          </List.Description>
        </List.Content>
      </List.Item>
    );
  };

  private projectSelected = (currentProject: ProjectFragment) => async () => {
    const { history, updateLocalProject } = this.props;

    await updateLocalProject({ variables: { currentProject } });
    history.push(makeNewQuoteURL());
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
