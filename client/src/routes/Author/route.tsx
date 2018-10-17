import * as React from "react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import "./author-route.css";
import RootHeader from "../../components/header.component";
import { setTitle } from "../../routes/util";
import { makeSourceURL } from "../../routes/util";
import { Props } from "./utils";
import { State } from "./utils";
import MobileBottomMenu from "../../components/mobile-bottom-menu.component";
import { MenuItem } from "../../components/mobile-bottom-menu.component";
import { AuthorRouteFrag_sources } from "../../graphql/gen.types";

export class Author extends React.Component<Props, State> {
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

        <MobileBottomMenu items={[MenuItem.HOME, MenuItem.SEARCH]} />
      </div>
    );
  }

  renderMainOrLoading = () => {
    const { loading, author, error } = this.props;

    if (error) {
      return <div className="">{error.message}</div>;
    }

    if (loading || !author) {
      return (
        <Dimmer inverted={true} className="" active={true}>
          <Loader size="medium">Loading..</Loader>
        </Dimmer>
      );
    }

    return (
      <div className="main">
        <div className="text">{author.name}</div>

        <hr />

        {author.sources && (
          <div>
            <h4>Sources</h4>

            <List divided={true}>{author.sources.map(this.renderSource)}</List>
          </div>
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
}

export default Author;
