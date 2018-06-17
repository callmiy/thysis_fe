import { withApollo } from "react-apollo";
import { withRouter } from "react-router-dom";

import QuotesSidebar from "./component";

export default withRouter(withApollo(QuotesSidebar));
