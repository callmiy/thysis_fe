import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Header } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import { List } from "semantic-ui-react";

import RootHeader from "../../components/header.component";
import { TagQuoteQueryComponent } from "../../graphql/ops.types";
import TAG_QUOTE_QUERY from "../../graphql/tag-with-quotes.query";
import { TagQuoteQuery } from "../../graphql/gen.types";
import MobileBottomMenu from "../../components/mobile-bottom-menu.component";
import { MenuItem } from "../../components/mobile-bottom-menu.component";
import renderQuote from "../../components/quote-item.component";
import { setTitle } from "../../utils/route-urls.util";
import { styles } from "./styles";
import { classes } from "./styles";

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
      <div className={`${classes.tagDetailRoot}`}>
        <RootHeader title="Tag Detail" />

        <TagQuoteQueryComponent
          query={TAG_QUOTE_QUERY}
          variables={{ tag: { id } }}
        >
          {({ data, loading }) => {
            return (
              <div className={`${classes.tagDetailRoot}`}>
                {(loading || !data) && (
                  <Dimmer
                    className={`${classes.tagDetailRoot}`}
                    active={true}
                    inverted={true}
                  >
                    <Loader size="mini">Loading</Loader>
                  </Dimmer>
                )}

                {this.renderMain(data)}
              </div>
            );
          }}
        </TagQuoteQueryComponent>

        <MobileBottomMenu items={[MenuItem.HOME, MenuItem.TAG_LIST]} />
      </div>
    );
  }

  renderMain = (data: TagQuoteQuery | undefined) => {
    if (!data || !data.tag) {
      return undefined;
    }

    const tag = data.tag;

    return (
      <div className={`${classes.tagDetailRoot}`}>
        <Header style={styles.tagText} as="h3" dividing={true}>
          {tag.text}
        </Header>

        <div className={`${classes.tagDetailMain}`}>
          <List divided={true} relaxed={true}>
            {tag.quotes && tag.quotes.map(renderQuote)}
          </List>
        </div>
      </div>
    );
  };
}

export default TagDetail;
