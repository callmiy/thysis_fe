import * as React from "react";
import jss from "jss";
import preset from "jss-preset-default";
import { RouteComponentProps } from "react-router-dom";

import Header from "../components/header.component";
import NewQuoteForm from "../components/new-quote-form.component";
import { SimpleCss, ROOT_CONTAINER_STYLE } from "../constants";
import { TagFragFragment } from "../graphql/gen.types";
import MobileBottomMenu, {
  MenuItem
} from "../components/mobile-bottom-menu.component";

jss.setup(preset());

const styles = {
  homeRoot: ROOT_CONTAINER_STYLE,

  homeMain: {
    flex: 1,
    overflowX: "hidden",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column"
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

export default class Home extends React.Component<HomeProps> {
  constructor(props: HomeProps) {
    super(props);
  }

  render() {
    return (
      <div className={`${classes.homeRoot}`}>
        <Header title="Home" />

        <div className={classes.homeMain}>
          <NewQuoteForm />
        </div>

        <MobileBottomMenu
          items={[
            MenuItem.NEW_TAG,
            MenuItem.NEW_SOURCE,
            MenuItem.TAG_LIST,
            MenuItem.SOURCE_LIST
          ]}
        />
      </div>
    );
  }
}
