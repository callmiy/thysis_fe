import React, { MouseEvent } from "react";
import { Tab } from "semantic-ui-react";
import { TabProps } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import update from "immutability-helper";
import { ApolloError } from "apollo-client";

import "./new-quote-sidebar.scss";
import {
  SourceFullFrag,
  Sources1Query,
  Sources1QueryVariables,
  Quotes1_quotes,
  Quotes1,
  Quotes1Variables,
  TagsMinimal,
  TagFrag
} from "../../graphql/gen.types";
import QUOTES_QUERY from "../../graphql/quotes-1.query";
import TAGS_QUERY from "../../graphql/tags-mini.query";
import SOURCES_QUERY from "../../graphql/sources-1.query";
import { sourceDisplay } from "../../graphql/utils";
import SearchQuotesComponent from "../../components/SearchComponent";
import { makeSourceURL } from "../../routes/util";
import { makeTagURL } from "../../routes/util";
import Loading from "../../components/Loading";
import { Props, State, ResourceName, Resources } from "./new-quote-sidebar";

export class QuotesSidebar extends React.Component<Props, State> {
  state: State = {};

  render() {
    return (
      <Tab
        className={`src-components-new-quote-sidebar ${this.props.className ||
          ""}`}
        menu={{
          pointing: true,
          inverted: true,
          secondary: true
        }}
        panes={[
          this.renderQuotes(),
          this.renderTags(),
          this.renderSources(),
          this.renderSearch()
        ]}
        onTabChange={this.onTabChange}
        defaultActiveIndex={-1}
      />
    );
  }

  onTabChange = (event: MouseEvent<HTMLDivElement>, props: TabProps) => {
    switch (props.activeIndex) {
      case 0:
        this.fetchQuotes();
        break;

      case 1:
        this.fetchTags();
        break;

      case 2:
        this.fetchSources();
        break;

      default:
        break;
    }
  };

  renderError = (resource: string) => {
    const { graphQlError } = this.state;
    resource = resource.toLowerCase();
    resource = resource.charAt(0).toUpperCase() + resource.slice(1);

    return (
      <div className="message-container error">
        <Icon className="message-icon" name="warning sign" />

        <div>
          <div className="message-header">{`Error fetching: ${resource}`}</div>

          <div>{graphQlError && graphQlError.message}</div>
        </div>
      </div>
    );
  };

  renderResourcesOr(resourcesName: ResourceName) {
    const { loading, graphQlError } = this.state;

    if (graphQlError) {
      return this.renderError(resourcesName);
    }

    const resources = this.state[resourcesName] as Resources;

    if (loading && !resources) {
      return <Loading />;
    }

    if (resources && resources.length) {
      return (
        <List divided={true} relaxed={true} ordered={true}>
          {resources.map(this["render" + resourcesName.slice(0, -1)])}
        </List>
      );
    }

    return <div>{`No ${resourcesName}!`}</div>;
  }

  renderQuotes = () => {
    return {
      menuItem: "Quotes",
      render: () => (
        <Tab.Pane
          className="pane"
          attached={false}
          loading={this.state.loading}
        >
          {this.renderResourcesOr(ResourceName.QUOTES)}
        </Tab.Pane>
      )
    };
  };

  renderquote = ({ id, text }: Quotes1_quotes) => {
    return (
      <List.Item key={id}>
        <List.Content>{text}</List.Content>
      </List.Item>
    );
  };

  renderTags = () => {
    return {
      menuItem: "Tags",
      render: () => (
        <Tab.Pane
          className="pane"
          attached={false}
          loading={this.state.loading}
        >
          {this.renderResourcesOr(ResourceName.TAGS)}
        </Tab.Pane>
      )
    };
  };

  rendertag = ({ id, text }: TagFrag) => {
    return (
      <List.Item
        key={id}
        className="list-item"
        onClick={this.navigateTo(makeTagURL(id))}
      >
        <List.Content>{text}</List.Content>
      </List.Item>
    );
  };

  renderSources = () => {
    return {
      menuItem: "Sources",
      render: () => (
        <Tab.Pane
          className="pane"
          attached={false}
          loading={this.state.loading}
        >
          {this.renderResourcesOr(ResourceName.SOURCES)}
        </Tab.Pane>
      )
    };
  };

  rendersource = (source: SourceFullFrag) => {
    const { id } = source;
    const display = sourceDisplay(source);
    return (
      <List.Item
        key={id}
        className="list-item"
        onClick={this.navigateTo(makeSourceURL(id))}
      >
        <List.Content>{display}</List.Content>
      </List.Item>
    );
  };

  renderSearch = () => {
    return {
      menuItem: "Search",
      render: () => (
        <Tab.Pane
          className="pane"
          attached={false}
          loading={this.state.loading}
        >
          <SearchQuotesComponent />
        </Tab.Pane>
      )
    };
  };

  fetchQuotes = async () => {
    this.fetching();

    try {
      const result = await this.props.client.query<Quotes1, Quotes1Variables>({
        query: QUOTES_QUERY,
        variables: {
          quote: {
            source: null
          }
        }
      });

      const quotes = result.data.quotes as Quotes1_quotes[];
      this.fetching(ResourceName.QUOTES, quotes);
    } catch (error) {
      this.fetching(undefined, undefined, error);
    }
  };

  fetchTags = async () => {
    this.fetching();

    try {
      const result = await this.props.client.query<TagsMinimal>({
        query: TAGS_QUERY
      });

      const data = result.data.tags as TagFrag[];
      this.fetching(ResourceName.TAGS, data);
    } catch (error) {
      this.fetching(undefined, undefined, error);
    }
  };

  fetchSources = async () => {
    const { currentProject } = this.props;

    if (!currentProject) {
      this.setState({ graphQlError: { message: "No project selected." } });
      return;
    }

    this.fetching();

    try {
      const projectId = currentProject.id;
      const result = await this.props.client.query<
        Sources1Query,
        Sources1QueryVariables
      >({
        query: SOURCES_QUERY,
        variables: {
          source: { projectId }
        }
      });

      const data = result.data.sources as SourceFullFrag[];
      this.fetching(ResourceName.SOURCES, data);
    } catch (error) {
      this.fetching(undefined, undefined, error);
    }
  };

  fetching = (
    resource?: ResourceName,
    result?: Quotes1_quotes[] | TagFrag[] | SourceFullFrag[],
    error?: ApolloError
  ) => {
    this.setState({ graphQlError: undefined });

    if (error) {
      this.setState({ loading: false, graphQlError: error });
      return;
    }

    if (resource && result) {
      this.setState(s =>
        update(s, {
          loading: {
            $set: false
          },

          [resource]: {
            $set: result
          },

          graphQlError: {
            $set: undefined
          }
        })
      );

      return;
    }

    this.setState({ loading: true });
  };

  navigateTo = (url: string) => () => {
    this.props.history.push(url);
  };
}

export default QuotesSidebar;
