import { OwnProps as NewAuthorModalProps } from "../../../components/NewAuthorModal/new-author-modal";
import { OwnProps as SourceModalProps } from "../../../components/SourceModal/source-modal";
import { AuthorFrag } from "../../../graphql/gen.types";

export interface Props {
  childProps: NewAuthorModalProps;
  newSourceModalProps: SourceModalProps;
}

export interface State {
  authors: AuthorFrag[];
  showSourceModal?: boolean;
}

export const initialState: State = {
  authors: []
};
