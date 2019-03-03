import { InputOnChangeData } from "semantic-ui-react/dist/commonjs/elements/Input/Input";

export type SemanticOnInputChangeFunc = (
  e: React.ChangeEvent<HTMLInputElement>,
  data: InputOnChangeData
) => void;

// tslint:disable-next-line:no-any
export const logger = async (prefix: string, tag: string, ...data: any) => {
  if (process.env.NODE_ENV === "development") {
    // tslint:disable-next-line:no-console
    console[prefix](
      "\n\n     =======logging starts======\n",
      tag,
      "\n",
      ...data,
      "\n     =======logging ends======\n"
    );
  }
};
