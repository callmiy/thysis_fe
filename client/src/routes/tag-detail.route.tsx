import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { RouteComponentProps } from "react-router-dom";
import { Header, Dimmer, Loader, List } from "semantic-ui-react";

import RootHeader from "../components/header.component";
import { ROOT_CONTAINER_STYLE, SimpleCss } from "../constants";
import { TagQuoteRunQuery } from "../graphql/ops.types";
import TAG_QUOTE_QUERY from "../graphql/tag-with-quotes.query";
import { TagQuoteQuery } from "../graphql/gen.types";
import MobileBottomMenu, {
  MenuItem
} from "../components/mobile-bottom-menu.component";
import renderQuote from "../components/quote-item.component";
import { setTitle } from "../utils/route-urls.util";

jss.setup(preset());

const styles = {
  tagDetailRoot: ROOT_CONTAINER_STYLE,

  tagDetailMain: {
    flex: 1,
    overflowX: "hidden",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "0 5px 15px 10px"
  },

  tagText: {
    padding: "3px 5px 10px 5px",
    marginBottom: 0
  }
} as SimpleCss;

const { classes } = jss.createStyleSheet(styles).attach();

type TagDetailProps = RouteComponentProps<{ id: string }>;

export default class TagDetail extends React.Component<TagDetailProps> {
  constructor(props: TagDetailProps) {
    super(props);

    ["renderMain"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

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

        <TagQuoteRunQuery query={TAG_QUOTE_QUERY} variables={{ tag: { id } }}>
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
        </TagQuoteRunQuery>

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
