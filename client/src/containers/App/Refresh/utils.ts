import * as React from "react";
import { DataValue } from "react-apollo";
import { RouteProps } from "react-router-dom";

import { UserLocalMutationProps } from "../../../state/user.local.mutation";
import { RefreshUserQuery } from "../../../graphql/gen.types";
import { RefreshUserQueryVariables } from "../../../graphql/gen.types";

export interface OwnProps extends UserLocalMutationProps {
  jwt: string;
  componentProps: RouteProps & {
    component: React.ComponentClass | React.StatelessComponent;
  };
}

export type Props = OwnProps &
  DataValue<RefreshUserQuery, RefreshUserQueryVariables>;
