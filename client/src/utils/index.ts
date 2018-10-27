import { InputOnChangeData } from "semantic-ui-react/dist/commonjs/elements/Input/Input";

export type SemanticOnInputChangeFunc = (
  e: React.ChangeEvent<HTMLInputElement>,
  data: InputOnChangeData
) => void;
