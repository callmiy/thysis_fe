import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { RouteComponentProps } from "react-router-dom";

import { POSITION_RELATIVE, POSITION_ABSOLUTE } from "../constants";
import { Loading } from "../App";
import { TagFragmentFragment } from "../graphql/gen.types";
import { TagsMinimalRunQuery } from "../graphql/ops.types";
import TAGS_QUERY from "../graphql/tags-minimal.query";

jss.setup(preset());

const styles = {
  link: {
    textDecoration: "none"
  },

  tagsContainer: {
    boxShadow: `
    0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12)`,
    background: "#fff"
  },

  tagItemContainer: {
    display: "flex",
    padding: 5,
    "&:hover": {
      background: "#e8e2e2"
    },
    margin: 5,
    cursor: "pointer"
  },

  tagItem: {
    flex: 1,
    margin: "5px 0 0 10px",
    borderBottom: "1px solid #dccfcf",
    position: POSITION_RELATIVE
  },

  tagItemLast: {
    borderBottom: "none"
  },

  tagItemMenuIcon: {
    position: POSITION_ABSOLUTE,
    right: -15,
    top: -15
  }
};

const { classes } = jss.createStyleSheet(styles).attach();

// A SINGLE TAG

type ATag = TagFragmentFragment;

interface TagComponentProps {
  tag: ATag;
  index: number;
  isLast: boolean;
}

class TagComponent extends React.PureComponent<TagComponentProps> {
  render() {
    const { id, text } = this.props.tag;
    // const className = `${classes.tagItem} ${
    //   this.props.isLast ? classes.tagItemLast : ""
    // } `;

    return (
      <div key={id} className={`${classes.tagItemContainer}`}>
        {text}
      </div>
    );
  }
}

// A LIST OF TAGS
interface TagsListProps {
  tags: ATag[];
}

// tslint:disable-next-line:max-classes-per-file
class TagsList extends React.PureComponent<TagsListProps> {
  tagsLen: number;

  constructor(props: TagsListProps) {
    super(props);
    this.renderTag = this.renderTag.bind(this);

    this.tagsLen = props.tags.length;
  }

  render() {
    return (
      <div className={`${classes.tagsContainer}`}>
        {this.props.tags.map(this.renderTag)}
      </div>
    );
  }

  renderTag(tag: ATag, index: number) {
    return (
      <TagComponent
        key={tag.id + index}
        tag={tag}
        index={index}
        isLast={this.tagsLen - 1 === index}
      />
    );
  }
}

// HOME ROUTE COMPONENT

type HomeProps = RouteComponentProps<{}>;

// tslint:disable-next-line:max-classes-per-file
export default class Home extends React.Component<HomeProps, {}> {
  constructor(props: HomeProps) {
    super(props);
  }

  render() {
    return (
      <TagsMinimalRunQuery query={TAGS_QUERY}>
        {({ loading, error, data }) => {
          if (loading || !data) {
            return <Loading />;
          }

          const tags = data.tags as ATag[];

          return (
            <div className={``}>
              <TagsList tags={tags} />
            </div>
          );
        }}
      </TagsMinimalRunQuery>
    );
  }
}
