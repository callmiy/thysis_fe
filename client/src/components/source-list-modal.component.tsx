import React from "react";
import { Modal, List } from "semantic-ui-react";
import jss from "jss";
import preset from "jss-preset-default";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { GraphqlQueryControls, graphql } from "react-apollo";

import { SourceFragFragment, Sources1Query } from "../graphql/gen.types";
import SOURCES_QUERY from "../graphql/sources-1.query";
import {
  FLEX_DIRECTION_COLUMN,
  OVERFLOW_X_HIDDEN,
  makeSourceURL
} from "../constants";
import { reshapeSources } from "./new-quote-form.component";

jss.setup(preset());

const styles = {
  modal: {
    marginTop: "10%",
    overflowX: OVERFLOW_X_HIDDEN,
    display: "flex",
    flexDirection: FLEX_DIRECTION_COLUMN,
    flex: 1,
    flexShrink: 0, // don't allow flexbox to shrink it
    borderRadius: 0, // clear semantic-ui style
    margin: 0, // clear semantic-ui style
    minWidth: "100%"
  },

  modalContent: {
    maxHeight: "calc(90vh)"
  },

  list: {
    background: "#fff",
    padding: "3px"
  },

  listItem: {
    cursor: "pointer"
  }
};

type OwnProps = RouteComponentProps<{}> & {
  open: boolean;
  dismissModal: () => void;
  style?: React.CSSProperties;
};

type ComponentDataProps = GraphqlQueryControls & Sources1Query;

type SourceListModalProps = OwnProps & ComponentDataProps;

class SourceListModal extends React.PureComponent<SourceListModalProps> {
  constructor(props: SourceListModalProps) {
    super(props);

    ["navigateTo", "renderSource", "resetModal"].forEach(
      fn => (this[fn] = this[fn].bind(this))
    );
  }

  render() {
    const { open, sources } = this.props;

    return (
      <Modal
        className={`aja`}
        style={styles.modal}
        basic={true}
        size="fullscreen"
        open={open}
        closeIcon={true}
        onClose={this.resetModal}
        dimmer="inverted"
      >
        <Modal.Content style={styles.modalContent} scrolling={true}>
          <List style={styles.list} divided={true} relaxed={true}>
            {(sources || []).map(this.renderSource)}
          </List>
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
