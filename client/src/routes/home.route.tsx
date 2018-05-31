import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { RouteComponentProps } from "react-router-dom";

import Header from "../components/header.component";
import Tags from "../components/tags.component";
import NewQuote from "../components/new-quote.component";
import { SimpleCss } from "../constants";
import { TagFragmentFragment } from "../graphql/gen.types";

jss.setup(preset());

const styles = {
  root: {
    height: "100%"
  },

  container: {
    display: "flex"
  },

  main: {
    flex: 1,
    marginRight: "5px"
  },

  tags: {
    overflowY: "scroll",
    height: "600px"
  }
} as SimpleCss;

const { classes } = jss.createStyleSheet(styles).attach();

export type AddTagContext = (tag: TagFragmentFragment) => void;
export type RemoveTagContext = (id: string) => void;

export interface TagContextValue {
  tags: TagFragmentFragment[];
  addTag: AddTagContext;
  removeTag: RemoveTagContext;
}

const TagContext = React.createContext<TagContextValue>({} as TagContextValue);

export const TagContextConsumer = TagContext.Consumer;

// HOME ROUTE COMPONENT

type HomeProps = RouteComponentProps<{}>;

interface HomeState {
  selectedTags: TagFragmentFragment[];
}

// tslint:disable-next-line:max-classes-per-file
export default class Home extends React.Component<HomeProps, HomeState> {
  state: HomeState = {
    selectedTags: []
  };

  constructor(props: HomeProps) {
    super(props);
    this.addTag = this.addTag.bind(this);
    this.removeTag = this.removeTag.bind(this);
  }

  render() {
    return (
      <div className={`${classes.root}`}>
        <Header title="Home" />

        <TagContext.Provider
          value={{
            tags: this.state.selectedTags,
            addTag: this.addTag,
            removeTag: this.removeTag
          }}
        >
          <div className={`${classes.container}`}>
            <div className={`${classes.main}`}>
              <NewQuote />
            </div>
            <Tags className={`${classes.tags}`} />
          </div>
        </TagContext.Provider>
      </div>
    );
  }

  addTag = (tag: TagFragmentFragment) => {
    const selectedTags = this.state.selectedTags;

    if (selectedTags.find(aTag => aTag === tag)) {
      return;
    }

    this.setState(prevState => ({
      ...prevState,
      selectedTags: [...selectedTags, tag]
    }));
  };

  removeTag = (id: string) => {
    const selectedTags = this.state.selectedTags.filter(tag => tag.id !== id);

    this.setState(prevState => ({
      ...prevState,
      selectedTags
    }));
  };
}
