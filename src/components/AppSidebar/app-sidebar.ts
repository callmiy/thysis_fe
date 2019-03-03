import { RouteComponentProps } from "react-router";

import { CurrProjLocalGqlProps } from "../../state/project.local.query";
import { TagModalCreatedCb } from "../../components/NewTagModalForm/utils";
import { UserLocalGqlProps } from "../../state/auth-user.local.query";

export interface OwnProps {
  children: JSX.Element;
  onTagCreated?: TagModalCreatedCb;
}

export type Props = RouteComponentProps<{}> &
  OwnProps &
  CurrProjLocalGqlProps &
  UserLocalGqlProps;

export interface State {
  modalState: {
    newTag: boolean;
    newSource: boolean;
    tagList: boolean;
  };
}

export const initialState: State = {
  modalState: {
    newTag: false,
    newSource: false,
    tagList: false
  }
};
