import { InputOnChangeData } from "semantic-ui-react/dist/commonjs/elements/Input/Input";

export type SemanticOnInputChangeFunc = (
  e: React.ChangeEvent<HTMLInputElement>,
  data: InputOnChangeData
) => void;

export const logData = async <T>(tag: string, ...data: T[]) => {
  if (process.env.NODE_ENV === "development") {
    // tslint:disable-next-line:no-console
    console.log(
      `
                  =======logging starts======
      ${tag}:

      `,
      data,
      `
                  =======logging ends========
      `
    );
  }
};
