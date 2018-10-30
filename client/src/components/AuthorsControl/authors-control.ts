import { AuthorFrag } from "../../graphql/gen.types";
import { CurrentProjectLocalData } from "../../state/project.local.query";
import { DataValue } from "react-apollo";

export interface OwnProps {
  selectError: boolean;
  handleChange: (value: AuthorFrag[]) => void;
  handleBlur: () => void;
  name: string;
  value: AuthorFrag[];
}

export type CurrentProjGqlProps = DataValue<CurrentProjectLocalData>;

export type Props = OwnProps & CurrentProjGqlProps;
