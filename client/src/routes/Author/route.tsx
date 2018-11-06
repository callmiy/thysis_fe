import * as React from "react";
import { Icon } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import update from "immutability-helper";

import "./author-route.css";
import RootHeader from "../../components/Header";
import NewAuthorModal from "../../components/NewAuthorModal";
import { setTitle } from "../../routes/util";
import { makeSourceURL } from "../../routes/util";
import { Props } from "./author";
import { State } from "./author";
import { AuthorRouteFrag_sources, AuthorFrag } from "../../graphql/gen.types";
import { authorFullName } from "../../graphql/utils";
import Loading from "src/components/Loading";

export class Author extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, currentState: State) {
    const { author } = nextProps;

    if (author && !currentState.author) {
      return update(currentState, {
        author: {
          $set: author
        }
      });
    }

    return null;
  }

  state: State = { isEditing: false };

  componentDidMount() {
    setTitle("Author");
  }

  componentWillUnmount() {
    setTitle();
  }

  render() {
    return (
      <div className="author-route">
        <RootHeader title="Author" />

        {this.renderMainOrLoading()}
      </div>
    );
  }

  renderMainOrLoading = () => {
    const { loading, error } = this.props;
    const { author } = this.state;

    if (error) {
      return <div className="">{error.message}</div>;
    }

    if (loading || !author) {
      return <Loading />;
    }

    return (
      <div className="main">
        {this.state.isEditing && (
          <NewAuthorModal
            author={author}
            open={this.state.isEditing}
            dismissModal={this.toggleEditModal}
            onAuthorCreated={this.authorEdited}
          />
        )}

        <div className="text">
          <span className="author-full-name">{authorFullName(author)}</span>

          <Icon
            name="edit"
            className="edit-author-icon"
            onClick={this.toggleEditModal}
          />
        </div>

        <hr />

        {author.sources && author.sources.length ? (
          <div>
            <h4>Sources</h4>

            <List divided={true}>{author.sources.map(this.renderSource)}</List>
          </div>
        ) : (
          undefined
        )}
      </div>
    );
  };

  private renderSource = ({ id, display }: AuthorRouteFrag_sources) => {
    return (
      <List.Item as={NavLink} to={makeSourceURL(id)} key={id} className="text">
        <div>{display}</div>
      </List.Item>
    );
  };

  private toggleEditModal = () => {
    this.setState(s =>
      update(s, {
        isEditing: {
          $set: !this.state.isEditing
        }
      })
    );
  };

  private authorEdited = ({ firstName, middleName, lastName }: AuthorFrag) => {
    this.setState(s =>
      update(s, {
        author: {
          firstName: {
            $set: firstName
          },

          middleName: {
            $set: middleName
          },

          lastName: {
            $set: lastName
          }
        }
      })
    );
  };
}

export default Author;
