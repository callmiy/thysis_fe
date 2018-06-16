import { withRouter } from "react-router-dom";

import { TagListModalProps } from "./utils";
import { TagListModal } from "./component";

export default withRouter<TagListModalProps>(TagListModal);
