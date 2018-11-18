import { RouteComponentProps } from "react-router-dom";
import { ApolloError } from "apollo-client";
import { FetchResult } from "react-apollo";
import { WithFormikConfig, InjectedFormikProps } from "formik";
import { FormikErrors } from "formik";

import { SourceFullFrag } from "../../graphql/gen.types";
import { SourceTypeFrag } from "../../graphql/gen.types";
import { AuthorFrag } from "../../graphql/gen.types";
import { CreateSource } from "../../graphql/gen.types";
import { CreateSourceFn } from "../../graphql/source.mutation";
import { CurrentProjectLocalData } from "../../state/project.local.query";
import { authorFullName } from "src/graphql/utils";

export interface FormValues {
  sourceType: SourceTypeFrag | null;
  authors: AuthorFrag[];
  topic: string;
  publication: string;
  url: string;
  year: string;
}

type FormErrors = { [k in keyof FormValues]: string };

export const initialFormValues: FormValues = {
  sourceType: null,
  authors: [],
  topic: "",
  publication: "",
  url: "",
  year: ""
};

export interface State {
  source?: SourceFullFrag;
  formError?: ApolloError | { message: string };
  open: boolean;
}

export const initialState: State = { open: true };

export interface OwnProps extends CurrentProjectLocalData {
  open: boolean;
  dismissModal?: () => void;
  style?: React.CSSProperties;
  existingSource?: ExistingSourceProps;
  createSource?: CreateSourceFn;
  authors?: AuthorFrag[];
}

export interface CreateSourceProps {
  createSource: (
    values: FormValues
  ) => Promise<void | FetchResult<CreateSource>>;
}

type PropsWithFormikProps = InjectedFormikProps<OwnProps, FormValues>;

export type Props = PropsWithFormikProps &
  RouteComponentProps<{}> &
  OwnProps &
  CreateSourceProps;

export const formikConfig: WithFormikConfig<Props, FormValues> = {
  handleSubmit: async values => null,

  mapPropsToValues: ({ authors }) => {
    const formAuthors = (authors || []).map((a: AuthorFrag) => ({
      ...a,
      fullName: authorFullName(a)
    }));

    return { ...initialFormValues, authors: formAuthors };
  },

  enableReinitialize: true,

  validate: values => {
    const errors: FormikErrors<FormErrors> = {};

    if (!values.sourceType) {
      errors.sourceType = "Select a source type";
    } else if (!values.authors || !values.authors.length) {
      errors.authors = "Select at least one author";
    } else if (!values.topic || !values.topic.trim()) {
      errors.topic = "Enter source topic according to author(s)";
    }

    return errors;
  }
};

export interface ExistingSourceProps {
  onSourceChanged?: OnSourceChangedCb;
  source: SourceFullFrag;
}

export type OnSourceChangedCb = (source: SourceFullFrag) => void;
