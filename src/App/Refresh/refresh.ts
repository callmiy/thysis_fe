import * as React from "react";
import { DataValue, WithApolloClient } from "react-apollo";
import { RouteProps } from "react-router-dom";

import { UserLocalMutationProps } from "../../state/user.local.mutation";
import { CurrentProjectLocalData } from "../../state/project.local.query";
import { RefreshUserQuery } from "../../graphql/gen.types";
import { ProjectFragment } from "../../graphql/gen.types";
import { RefreshUserQueryVariables } from "../../graphql/gen.types";

export interface OwnProps
  extends UserLocalMutationProps,
    CurrentProjectLocalData,
    WithApolloClient<{}> {
  jwt: string;
  componentProps: RouteProps & {
    component: React.ComponentClass | React.StatelessComponent;
  };
  project?: ProjectFragment | null;
}

export type Props = OwnProps &
  DataValue<RefreshUserQuery, RefreshUserQueryVariables>;
