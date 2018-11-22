import React from "react";
import { ApolloError } from "apollo-client";

import { TagFrag, CreateTagInput } from "../../graphql/gen.types";

export type TagModalCreatedCb = (tag: TagFrag) => void;

export interface Props {
  open: boolean;
  dismissModal: () => void;
  style: React.CSSProperties;
  onTagCreated?: TagModalCreatedCb;
}

export interface State extends CreateTagInput {
  formError?: ApolloError;
  submitting: boolean;
  submitSuccess: boolean;
}

export const initialState: State = {
  text: "",
  formError: undefined,
  submitting: false,
  submitSuccess: false
};
