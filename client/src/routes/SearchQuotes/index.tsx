import { withApollo } from "react-apollo";

import SearchQuotes from "./route";
import { OwnProps } from "./utils";

export default withApollo<OwnProps>(SearchQuotes);
