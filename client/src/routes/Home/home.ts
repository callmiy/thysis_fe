import { RouteComponentProps } from "react-router-dom";

import { CurrentProjectLocalData } from "../../state/project.local.query";
import { UserLocalGqlData } from "../../state/auth-user.local.query";
import { ProjectFragment } from "src/graphql/gen.types";

export interface State {
  modalOpened: {};
  selectedProject?: ProjectFragment;
}

export type Props = RouteComponentProps<{}> &
  CurrentProjectLocalData &
  UserLocalGqlData;

export enum MenuItem {
  TAG_LIST = "tagList",
  SOURCE_LIST = "sourceList",
  NEW_TAG = "newTag",
  NEW_SOURCE = "newSource",
  NEW_AUTHOR = "newAuthor"
}
