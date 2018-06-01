import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { RouteComponentProps } from "react-router-dom";

import Header from "../components/header.component";
import Tags from "../components/tags.component";
import NewQuote from "../components/new-quote.component";
import { SimpleCss } from "../constants";
import { TagFragFragment } from "../graphql/gen.types";

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

export type RemoveTagContext = (id: string) => void;

export interface TagContextValue {
  tags: TagFragFragment[];
  removeTag: RemoveTagContext;
}

const TagContext = React.createContext<TagContextValue>({} as TagContextValue);

export const TagContextConsumer = TagContext.Consumer;

// HOME ROUTE COMPONENT

type HomeProps = RouteComponentProps<{}>;

interface HomeState {
  selectedTags: TagFragFragment[];
}

// tslint:disable-next-line:max-classes-per-file
export default class Home extends React.Component<HomeProps, HomeState> {
  state: HomeState = {
    selectedTags: []
  };

  constructor(props: HomeProps) {
    super(props);
    this.removeTag = this.removeTag.bind(this);
  }

  render() {
    return (
      <div className={`${classes.root}`}>
        <Header title="Home" />

        <TagContext.Provider
          value={{
            tags: this.state.selectedTags,
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

  removeTag = (id: string) => {
    const selectedTags = this.state.selectedTags.filter(tag => tag.id !== id);

    this.setState(prevState => ({
      ...prevState,
      selectedTags
    }));
  };
}
