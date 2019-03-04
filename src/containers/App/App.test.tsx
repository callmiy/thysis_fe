import * as React from "react";
import * as ReactDOM from "react-dom";
import { App, Props } from "./container";
import { act } from "react-testing-library";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const props = {} as Props;
  act(() => {
    ReactDOM.render(<App {...props} />, div);
    expect(ReactDOM.unmountComponentAtNode(div)).toEqual(true);
  });
});
