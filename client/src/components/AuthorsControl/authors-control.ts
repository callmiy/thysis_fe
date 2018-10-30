import { AuthorFrag } from "../../graphql/gen.types";
import { CurrProjLocalGqlProps } from "../../state/project.local.query";

export interface OwnProps {
  selectError: boolean;
  handleChange: (value: AuthorFrag[]) => void;
  handleBlur: () => void;
  name: string;
  value: AuthorFrag[];
}

export type Props = OwnProps & CurrProjLocalGqlProps;
