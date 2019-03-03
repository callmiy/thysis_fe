import { AccordionTitleProps } from "semantic-ui-react";
import { WithApolloClient } from "react-apollo";
import { ApolloError } from "apollo-client";
import { InjectedFormikProps } from "formik";
import { WithFormikConfig } from "formik";
import { FormikErrors } from "formik";

import { SourceFullFrag, QuoteFromTagFrag } from "../../../graphql/gen.types";
import { UpdateSourceMutationFn } from "../../../graphql/ops.types";
import { AuthorWithFullName, authorFullName } from "../../../graphql/utils";

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

export type FormErrors = { [k in keyof FormOutput]: string };

export type PropsWithApolloClient = WithApolloClient<OwnProps>;

export type Props = InjectedFormikProps<PropsWithApolloClient, FormOutput> & {
  errors: FormErrors;
};

export enum AccordionIndex {
  DETAIL = 0,
  LIST_QUOTES = 1
}

export interface State {
  detailAction: DetailAction;
  loadingQuotes?: boolean;
  quotes?: QuoteFromTagFrag[];
  fetchQuotesError?: ApolloError;
  updateSourceError?: ApolloError;
  openUpdateSourceSuccessModal: boolean;
  accordionProps: { [T in AccordionIndex]: boolean };
}

export const initialState: State = {
  detailAction: DetailAction.VIEWING,
  openUpdateSourceSuccessModal: false,
  accordionProps: {
    [AccordionIndex.DETAIL]: true,
    [AccordionIndex.LIST_QUOTES]: false
  }
};

export const formikConfig: WithFormikConfig<Props, FormOutput> = {
  handleSubmit: async values => null,

  mapPropsToValues: ({ source }) => {
    const authors = source.authors.reduce(
      (acc2, a) => {
        if (a) {
          acc2.push({
            ...a,
            fullName: authorFullName(a)
          });
        }
        return acc2;
      },
      [] as AuthorWithFullName[]
    );

    return { ...source, authors };
  },

  enableReinitialize: true,

  validate: ({ authors, topic, sourceType }) => {
    const errors: FormikErrors<FormErrors> = {};

    if (!sourceType) {
      errors.sourceType = "Select a source type";
    }

    if (!authors || !authors.length) {
      errors.authors = "Select at least one author";
    }

    if (!topic || topic.length < 3) {
      errors.topic = "Enter source topic according to author(s)";
    }

    return errors;
  }
};
