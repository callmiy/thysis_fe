import * as React from "react";
import { WithApolloClient } from "react-apollo";
import { RouteProps } from "react-router-dom";

import { UserLocalMutationProps } from "../state/user.local.mutation";
import { CurrentProjectLocalData } from "../state/project.local.query";
import { RefreshUserQuery_refresh_projects } from "../graphql/apollo-types/RefreshUserQuery";
import { RefreshUserQueryMerkmale } from "../graphql/refresh-user.query";

export interface OwnProps
  extends UserLocalMutationProps,
    CurrentProjectLocalData,
    WithApolloClient<{}> {
  jwt: string;
  componentProps: RouteProps & {
    component: React.ComponentClass | React.StatelessComponent;
  };
  project?: RefreshUserQuery_refresh_projects | null;
}

export interface Props extends OwnProps, RefreshUserQueryMerkmale {}
