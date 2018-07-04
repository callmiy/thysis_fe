import { withRouter } from "react-router-dom";

import { TagListModalProps } from "./utils";
import { TagsModal } from "./component";

export default withRouter<TagListModalProps>(TagsModal);
