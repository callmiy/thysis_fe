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
import {
  Quote1Frag,
  Quotes1,
  Quotes1Variables,
  TagsMinimal
} from "../../../graphql/gen.types";
import { TagFrag } from "../../../graphql/gen.types";
import { SourceFullFrag } from "../../../graphql/gen.types";
import { Sources1QueryClientResult } from "../../../graphql/ops.types";
import QUOTES_QUERY from "../../../graphql/quotes-1.query";
import TAGS_QUERY from "../../../graphql/tags-mini.query";
import SOURCES_QUERY from "../../../graphql/sources-1.query";
import { sourceDisplay } from "../../../graphql/utils";
import SearchQuotesComponent from "../../../components/SearchComponent";
import { makeSourceURL } from "../../../routes/util";
import { makeTagURL } from "../../../routes/util";
import Loading from "../../../components/Loading";

enum ResourceName {
  QUOTES = "quotes",
  TAGS = "tags",
  SOURCES = "sources"
}

type Resources = Array<Quote1Frag | TagFrag | SourceFullFrag>;

interface OwnProps extends RouteComponentProps<{}> {
  className?: string;
}

type Props = WithApolloClient<OwnProps>;

interface State {
  quotes?: Quote1Frag[];
  tags?: TagFrag[];
  sources?: SourceFullFrag[];
  loading?: boolean;
  graphQlError?: ApolloError;
}

export class QuotesSidebar extends React.Component<Props, State> {
  state: State = {};

  render() {
    const className = this.props.className || "";

    return (
      <Tab
        className={className}
        menu={{
          pointing: true,
          inverted: true,
          tabular: false,
          style: { backgroundColor: "#5faac7" }
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

    if (graphQlError) {
      return this.renderError("Quotes");
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
          className={classes.pane}
          attached={false}
          loading={this.state.loading}
        >
          {this.renderResourcesOr(ResourceName.QUOTES)}
        </Tab.Pane>
      )
    };
  };

  renderquote = ({ id, text }: Quote1Frag) => {
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

  rendertag = ({ id, text }: TagFrag) => {
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

  rendersource = (source: SourceFullFrag) => {
    const { id } = source;
    const display = sourceDisplay(source);
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
      const result = await this.props.client.query<Quotes1, Quotes1Variables>({
        query: QUOTES_QUERY,
        variables: {
          quote: {
            source: null
          }
        }
      });

      const data = result.data.quotes as Quote1Frag[];
      this.fetching(ResourceName.QUOTES, data);
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
    this.fetching();

    try {
      const result = (await this.props.client.query({
        query: SOURCES_QUERY
      })) as Sources1QueryClientResult;

      const data = result.data.sources as SourceFullFrag[];
      this.fetching(ResourceName.SOURCES, data);
    } catch (error) {
      this.fetching(undefined, undefined, error);
    }
  };

  fetching = (
    resource?: ResourceName,
    result?: Quote1Frag[] | TagFrag[] | SourceFullFrag[],
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
