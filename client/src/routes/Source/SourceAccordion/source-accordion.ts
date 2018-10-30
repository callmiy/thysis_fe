import { AccordionTitleProps } from "semantic-ui-react";
import { WithApolloClient } from "react-apollo";
import { ApolloError } from "apollo-client";
import { InjectedFormikProps } from "formik";

import { SourceFullFrag } from "../../../graphql/gen.types";
import { Quote1Frag } from "../../../graphql/gen.types";
import { UpdateSourceMutationFn } from "../../../graphql/ops.types";
import { AuthorWithFullName } from "../../../graphql/utils";

export enum DetailAction {
  EDITING = "editing", // when we are editing source
  VIEWING = "viewing" // when we are viewing source
}

export interface FormOutput extends SourceFullFrag {
  authors: AuthorWithFullName[];
}

export type AccordionTitleClickCb = (
  event: React.MouseEvent<HTMLDivElement>,
  data: AccordionTitleProps
) => void;

export interface OwnProps {
  source: SourceFullFrag;
  updateSource: UpdateSourceMutationFn;
}

export type PropsWithApolloClient = WithApolloClient<OwnProps>;

export type PropsWithFormikProps = InjectedFormikProps<
  PropsWithApolloClient,
  FormOutput
>;

export type Props = PropsWithFormikProps;

export interface State {
  activeIndex: SourceAccordionIndex;
  detailAction: DetailAction;
  loadingQuotes?: boolean;
  quotes?: Quote1Frag[];
  fetchQuotesError?: ApolloError;
  updateSourceError?: ApolloError;
  openUpdateSourceSuccessModal: boolean;
}

export const initialState: State = {
  activeIndex: 0,
  detailAction: DetailAction.VIEWING,
  openUpdateSourceSuccessModal: false
};

export enum SourceAccordionIndex {
  DETAIL = 0,
  LIST_QUOTES = 1,
  NO_MATCH = -1
}
