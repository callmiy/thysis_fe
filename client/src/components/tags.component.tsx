import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";

import { TagFragFragment } from "../graphql/gen.types";
import { TagsMinimalRunQuery } from "../graphql/ops.types";
import TAGS_QUERY from "../graphql/tags-mini.query";
import { Loading } from "../App";
import { SimpleCss } from "../constants";

jss.setup(preset());

const styles = {
  container: {
    boxShadow: `
    0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12)`,
    background: "#fff",
    marginRight: "15px"
  },

  tag: {
    display: "flex",
    alignItems: "baseline",
    padding: 5,
    "&:hover": {
      background: "#e8e2e2"
    },
    margin: "5px 1.4px",
    cursor: "pointer",
    boxShadow: "0 1px 1px -1px #969696"
  },

  tagIndex: {
    marginRight: "10px",
    background: "#56abe8",
    borderRadius: "50%",
    color: "#fff",
    width: "40px",
    height: "40px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
} as SimpleCss;

const { classes } = jss.createStyleSheet(styles).attach();

// A SINGLE TAG

interface TagComponentProps {
  tag: TagFragFragment;
  index: number;
  isLast: boolean;
}

class TagComponent extends React.PureComponent<TagComponentProps> {
  render() {
    const { text } = this.props.tag;

    return <div>{text}</div>;
  }
}

interface TagsListProps {
  className?: {};
}

// tslint:disable-next-line:max-classes-per-file
export default class TagsList extends React.PureComponent<TagsListProps> {
  tagsLen: number;

  constructor(props: TagsListProps) {
    super(props);
    this.renderTag = this.renderTag.bind(this);
  }

  render() {
    return (
      <TagsMinimalRunQuery query={TAGS_QUERY}>
        {({ loading, error, data }) => {
          if (loading || !data) {
            return <Loading />;
          }

          const tags = data.tags as TagFragFragment[];

          return (
            <div className={`${classes.container} ${this.props.className}`}>
              {tags.map(this.renderTag)}
            </div>
          );
        }}
      </TagsMinimalRunQuery>
    );
  }

  renderTag(tag: TagFragFragment, index: number) {
    return (
      <div key={tag.id} className={`${classes.tag}`}>
        <span className={`${classes.tagIndex}`}>{index + 1}</span>
        <TagComponent
          tag={tag}
          index={index}
          isLast={this.tagsLen - 1 === index}
        />
      </div>
    );
  }
}
