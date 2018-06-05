import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { RouteComponentProps } from "react-router-dom";
import { Header, Dimmer, Loader, List } from "semantic-ui-react";
import { GraphqlQueryControls, graphql } from "react-apollo";

import RootHeader from "../components/header.component";
import { ROOT_CONTAINER_STYLE, SimpleCss } from "../constants";
import { Source1Query, Source1QueryVariables } from "../graphql/gen.types";
import SOURCE_QUERY from "../graphql/source-1.query";
import MobileBottomMenu, {
  MenuItem
} from "../components/mobile-bottom-menu.component";

jss.setup(preset());

const styles = {
  SourceRoot: ROOT_CONTAINER_STYLE,

  SourceMain: {
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
  },

  quoteItem: {
    wordBreak: "break-all",
    "&:first-of-type": {
      marginTop: "10px"
    }
  },

  quoteText: {
    cursor: "pointer"
  },

  quoteDate: {
    display: "flex",
    flexDirection: "row-reverse"
  },

  sourceDisplay: {
    fontStyle: "italic",
    fontSize: "0.9em",
    marginTop: "10px"
  }
} as SimpleCss;

const { classes } = jss.createStyleSheet(styles).attach();

type OwnProps = RouteComponentProps<{ id: string }> & Source1Query;

type SourceProps = OwnProps & GraphqlQueryControls<Source1QueryVariables>;

const sourceGraphQl = graphql<
  OwnProps,
  Source1Query,
  Source1QueryVariables,
  {}
>(SOURCE_QUERY, {
  props: ({ data }) => {
    return { ...data };
  },

  options: ({ match }) => {
    return {
      variables: {
        source: {
          id: match.params.id
        }
      }
    };
  }
});

class Source extends React.Component<SourceProps> {
  constructor(props: SourceProps) {
    super(props);

    // ["renderMain"].forEach(fn => (this[fn] = this[fn].bind(this)));
  }

  render() {
    const { loading, source } = this.props;

    if (loading || !source) {
      return (
        <Dimmer
          className={`${classes.SourceRoot}`}
          active={true}
          inverted={true}
        >
          <Loader size="mini">Loading</Loader>
        </Dimmer>
      );
    }

    return (
      <div className={`${classes.SourceRoot}`}>
        <RootHeader title="Tag Detail" />

        <div className={`${classes.SourceRoot}`}>
          <div className={`${classes.SourceRoot}`}>
            <Header style={styles.tagText} as="h3" dividing={true}>
              {source.display}
            </Header>

            <div className={`${classes.SourceMain}`}>
              <List divided={true} relaxed={true}>
                {source.display}
              </List>
            </div>
          </div>
        </div>

        <MobileBottomMenu items={[MenuItem.HOME, MenuItem.TAG_LIST]} />
      </div>
    );
  }

  // renderQuote = ({ id, text, date, source }: Source2FragFragment) => {
  //   return (
  //     <List.Item key={id} className={`${classes.quoteItem}`}>
  //       <List.Content>
  //         <List.Header className={`${classes.quoteText}`}>{text}</List.Header>

  //         {source && (
  //           <div className={`${classes.sourceDisplay}`}>{source.display}</div>
  //         )}

  //         <List.Description style={styles.quoteDate}>{date}</List.Description>
  //       </List.Content>
  //     </List.Item>
  //   );
  // };
}

export default sourceGraphQl(Source);
