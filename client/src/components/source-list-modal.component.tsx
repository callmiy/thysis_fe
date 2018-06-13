import React from "react";
import { Modal } from "semantic-ui-react";
import { List } from "semantic-ui-react";
import jss from "jss";
import preset from "jss-preset-default";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { GraphqlQueryControls, graphql } from "react-apollo";
import { Loader } from "semantic-ui-react";

import { SourceFragFragment, Sources1Query } from "../graphql/gen.types";
import SOURCES_QUERY from "../graphql/sources-1.query";
import { makeSourceURL } from "../utils/route-urls.util";
import { SimpleCss } from "../constants";

jss.setup(preset());

const modalStyle = {
  "&#source-list-modal-menu": {
    marginTop: ["5%", "!important"],
    display: ["flex", "!important"]
  }
  // tslint:disable-next-line:no-any
} as any;

const styles = {
  modal: {
    ...modalStyle,
    overflow: "hidden",
    flexDirection: "column",
    height: "100%"
  },

  modalClose: {
    flexShrink: 0,
    fontWeight: 900,
    fontSize: "2rem",
    textAlign: "right",
    cursor: "pointer"
  },

  modalContent: {
    maxHeight: "calc(80vh)",
    wordWrap: "break-word",
    border: "1px solid #dad8d8",
    flex: 1
  },

  list: {
    background: "#fff",
    padding: "3px"
  },

  listItem: {
    cursor: "pointer"
  }
} as SimpleCss;

const { classes } = jss.createStyleSheet(styles).attach();

const reshapeSource = (s: SourceFragFragment | null) => {
  if (!s) {
    return {} as SourceFragFragment;
  }

  return {
    ...s,
    display: `${s.display} | ${s.sourceType.name}`
  } as SourceFragFragment;
};

export const reshapeSources = (
  sources: SourceFragFragment[] | null
): SourceFragFragment[] => {
  if (!sources) {
    return [] as SourceFragFragment[];
  }

  return sources.map(reshapeSource);
};


type OwnProps = RouteComponentProps<{}> & {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
};

type ComponentDataProps = GraphqlQueryControls & Sources1Query;

type SourceListModalProps = OwnProps & ComponentDataProps;

class SourceListModal extends React.PureComponent<SourceListModalProps> {
  render() {
    const { open, sources, loading } = this.props;

    return (
      <Modal
        id="source-list-modal-menu"
        className={classes.modal}
        style={{ ...((loading && { height: "100%" }) || {}) }}
        basic={true}
        open={open}
        onClose={this.resetModal}
        dimmer="inverted"
      >
        <div className={classes.modalClose} onClick={this.props.dismissModal}>
          &times;
        </div>

        <Modal.Content style={styles.modalContent} scrolling={true}>
          {loading && !sources && <Loader active={true} />}

          {!loading &&
            sources && (
              <List style={styles.list} divided={true} relaxed={true}>
                {sources.map(this.renderSource)}
              </List>
            )}
        </Modal.Content>
      </Modal>
    );
  }

  renderSource = ({ id, display }: SourceFragFragment) => {
    return (
      <List.Item key={id} style={styles.listItem} onClick={this.navigateTo(id)}>
        <List.Content>{display}</List.Content>
      </List.Item>
    );
  };

  resetModal = () => {
    this.props.dismissModal();
  };

  navigateTo = (id: string) => () => {
    this.resetModal();
    this.props.history.push(makeSourceURL(id));
  };
}

const sourcesGraphQl = graphql<OwnProps, Sources1Query, {}, ComponentDataProps>(
  SOURCES_QUERY,
  {
    props: ({ data }) => {
      if (!data || !data.sources) {
        return data as ComponentDataProps;
      }

      const sources = data.sources as SourceFragFragment[];
      return {
        ...data,
        sources: reshapeSources(sources)
      } as ComponentDataProps;
    }
  }
);

export default withRouter(sourcesGraphQl(SourceListModal));
