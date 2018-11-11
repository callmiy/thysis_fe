import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./index";
import ApolloClient from "apollo-client";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const client = {} as ApolloClient<{}>;
  ReactDOM.render(<App client={client} />, div);
  expect(ReactDOM.unmountComponentAtNode(div)).toEqual(true);
});
