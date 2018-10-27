import { graphql } from "react-apollo";

import AUTH_USER_LOCAL_QUERY from "../../../state/auth-user.local.query";
import { LocalGraphQlData } from "./utils";
import { FromGraphQl } from "./utils";
import { OwnProps } from "./utils";
import { AuthRequired } from "./component";

const authUserLocalGraphQl = graphql<
  OwnProps,
  LocalGraphQlData,
  {},
  FromGraphQl
>(AUTH_USER_LOCAL_QUERY, {
  props: ({ data }) => {
    return data;
  }
});

export default authUserLocalGraphQl(AuthRequired);
