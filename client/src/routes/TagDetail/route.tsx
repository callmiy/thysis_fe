import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Header } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { List } from "semantic-ui-react";

import RootHeader from "../../components/Header";
import { TagQuoteQueryComponent } from "../../graphql/ops.types";
import TAG_QUOTE_QUERY from "../../graphql/tag-with-quotes.query";
import { TagQuote as TagQuoteQuery } from "../../graphql/gen.types";
import renderQuote from "../../components/QuoteItem";
import { setTitle } from "../../routes/util";
import { styles } from "./styles";
import { classes } from "./styles";
import AppSideBar from "src/components/AppSidebar";

type TagDetailProps = RouteComponentProps<{ id: string }>;

export class TagDetail extends React.Component<TagDetailProps> {
  componentDidMount() {
    setTitle("Tag");
  }

  componentWillUnmount() {
    setTitle();
  }

  render() {
    const id = this.props.match.params.id;

    return (
      <AppSideBar>
        <div className={`${classes.tagDetailRoot}`}>
          <RootHeader title="Tag Detail" showSideBarTrigger={true} />

          <TagQuoteQueryComponent
            query={TAG_QUOTE_QUERY}
            variables={{ tag: { id } }}
          >
            {({ data, loading, error }) => {
              if (error) {
                return (
                  <div
                    className={`${classes.tagDetailMain} ${
                      classes.errorContainer
                    }`}
                  >
                    {error.message}
                  </div>
                );
              }

              if (loading) {
                return (
                  <Dimmer
                    className={`${classes.tagDetailRoot}`}
                    active={true}
                    inverted={true}
                  >
                    <Loader size="mini">Loading</Loader>
                  </Dimmer>
                );
              }

              return (
                <div className={`${classes.tagDetailRoot}`}>
                  {this.renderMain(data)}
                </div>
              );
            }}
          </TagQuoteQueryComponent>
        </div>
      </AppSideBar>
    );
  }

  renderMain = (data: TagQuoteQuery | undefined) => {
    if (!data || !data.tag) {
      return undefined;
    }

    const { text, question, quotes } = data.tag;

    return (
      <div className={`${classes.tagDetailRoot}`}>
        <Header style={styles.tagText} as="h3" dividing={true}>
          {text}
          {question && (
            <div
              style={{
                paddingLeft: "10%",
                fontStyle: "italic",
                fontWeight: 100,
                fontSize: "0.8em"
              }}
            >
              {question}
            </div>
          )}
        </Header>

        <div className={`${classes.tagDetailMain}`}>
          <List divided={true} relaxed={true}>
            {quotes && quotes.map(renderQuote)}
          </List>
        </div>
      </div>
    );
  };
}

export default TagDetail;
