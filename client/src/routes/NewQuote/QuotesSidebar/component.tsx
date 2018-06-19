import React, { MouseEvent } from "react";
import { Tab } from "semantic-ui-react";
import { TabProps } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { WithApolloClient } from "react-apollo";
import update from "immutability-helper";
import { ApolloError } from "apollo-client";
import { RouteComponentProps } from "react-router-dom";

import { messageIconStyle } from "./styles";
import { classes } from "./styles";
import { Quote1FragFragment } from "../../../graphql/gen.types";
import { TagFragFragment } from "../../../graphql/gen.types";
import { SourceFragFragment } from "../../../graphql/gen.types";
import { Quotes1QueryClientResult } from "../../../graphql/ops.types";
import { TagsMinimalQueryClientResult } from "../../../graphql/ops.types";
import { Sources1QueryClientResult } from "../../../graphql/ops.types";
import QUOTES_QUERY from "../../../graphql/quotes-1.query";
import TAGS_QUERY from "../../../graphql/tags-mini.query";
import SOURCES_QUERY from "../../../graphql/sources-1.query";
import SearchQuotesComponent from "../../../components/SearchQuotesComponent";
import { makeSourceURL } from "../../../utils/route-urls.util";
import { makeTagURL } from "../../../utils/route-urls.util";

enum ResourceName {
  QUOTES = "quotes",
  TAGS = "tags",
  SOURCES = "sources"
}

type Resources = Array<
  Quote1FragFragment | TagFragFragment | SourceFragFragment
>;

interface OwnProps extends RouteComponentProps<{}> {
  className?: string;
}

type QuotesSidebarProps = WithApolloClient<OwnProps>;

interface QuotesSidebarState {
  quotes?: Quote1FragFragment[];
  tags?: TagFragFragment[];
  sources?: SourceFragFragment[];
  loading?: boolean;
  graphQlError?: ApolloError;
}

export class QuotesSidebar extends React.Component<
  QuotesSidebarProps,
  QuotesSidebarState
> {
  state: QuotesSidebarState = {};

  render() {
    const className = this.props.className || "";

    return (
      <Tab
        className={className}
        menu={{
          pointing: true,
          inverted: true,
          color: "green",
          tabular: false
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

    return (
      <div className={`${classes.messageContainer} error`}>
        <Icon style={messageIconStyle} name="warning sign" />

        <div>
          <div className={classes.messageHeader}>
            {`Error fetching: ${resource}`}
          </div>

          <div className={classes.messageAction}>
            {graphQlError && graphQlError.message}
          </div>
        </div>
      </div>
    );
  };

  renderResourcesOr(resourcesName: ResourceName) {
    const { loading, graphQlError } = this.state;
    const resources = this.state[resourcesName] as Resources;

    if (graphQlError) {
      return this.renderError("Quotes");
    }

    if (loading || !resources) {
      return undefined;
    }

    if (resources.length) {
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
          className={classes.pane}
          attached={false}
          loading={this.state.loading}
        >
          {this.renderResourcesOr(ResourceName.QUOTES)}
        </Tab.Pane>
      )
    };
  };

  renderquote = ({ id, text }: Quote1FragFragment) => {
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
          className={classes.pane}
          attached={false}
          loading={this.state.loading}
        >
          {this.renderResourcesOr(ResourceName.TAGS)}
        </Tab.Pane>
      )
    };
  };

  rendertag = ({ id, text }: TagFragFragment) => {
    return (
      <List.Item
        key={id}
        className={classes.listItem}
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
          className={classes.pane}
          attached={false}
          loading={this.state.loading}
        >
          {this.renderResourcesOr(ResourceName.SOURCES)}
        </Tab.Pane>
      )
    };
  };

  rendersource = ({ id, display }: SourceFragFragment) => {
    return (
      <List.Item
        key={id}
        className={classes.listItem}
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
          className={classes.pane}
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
      const result = (await this.props.client.query({
        query: QUOTES_QUERY,
        variables: {
          quote: {
            source: null
          }
        }
      })) as Quotes1QueryClientResult;
      const data = result.data.quotes as Quote1FragFragment[];
      this.fetching(ResourceName.QUOTES, data);
    } catch (error) {
      this.fetching(undefined, undefined, error);
    }
  };

  fetchTags = async () => {
    this.fetching();

    try {
      const result = (await this.props.client.query({
        query: TAGS_QUERY
      })) as TagsMinimalQueryClientResult;

      const data = result.data.tags as TagFragFragment[];
      this.fetching(ResourceName.TAGS, data);
    } catch (error) {
      this.fetching(undefined, undefined, error);
    }
  };

  fetchSources = async () => {
    this.fetching();

    try {
      const result = (await this.props.client.query({
        query: SOURCES_QUERY
      })) as Sources1QueryClientResult;

      const data = result.data.sources as SourceFragFragment[];
      this.fetching(ResourceName.SOURCES, data);
    } catch (error) {
      this.fetching(undefined, undefined, error);
    }
  };

  fetching = (
    resource?: ResourceName,
    result?: Quote1FragFragment[] | TagFragFragment[] | SourceFragFragment[],
    error?: ApolloError
  ) => {
    if (error) {
      return this.setState(s =>
        update(s, {
          loading: {
            $set: false
          },

          graphQlError: {
            $set: error
          }
        })
      );
    }

    if (resource && result) {
      return this.setState(s =>
        update(s, {
          loading: {
            $set: false
          },

          [resource]: {
            $set: result
          }
        })
      );
    }

    if (!result || !error) {
      return this.setState(s =>
        update(s, {
          loading: {
            $set: true
          }
        })
      );
    }
  };

  navigateTo = (url: string) => () => {
    this.props.history.push(url);
  };
}

export default QuotesSidebar;
