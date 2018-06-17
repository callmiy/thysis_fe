import { withApollo } from "react-apollo";

import SearchQuotes from "./component";
import { OwnProps } from "./utils";

export default withApollo<OwnProps>(SearchQuotes);
