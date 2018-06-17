import React from "react";
import { ApolloError } from "apollo-client";

import { TagFragFragment } from "../../graphql/gen.types";

export type TagModalCreatedCb = (tag: TagFragFragment) => void;

export interface NewTagModalFormProps {
  open: boolean;
  dismissModal: () => void;
  style: React.CSSProperties;
  onTagCreated?: TagModalCreatedCb;
}

export interface NewTagModalFormState {
  text: string;
  formError?: ApolloError;
  submitting: boolean;
  submitSuccess: boolean;
}

export const initalStateNewTagModalFormState: NewTagModalFormState = {
  text: "",
  formError: undefined,
  submitting: false,
  submitSuccess: false
};
