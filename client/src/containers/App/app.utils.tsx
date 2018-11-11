import * as React from "react";
import ApolloClient from "apollo-client";

export interface SideBarContextProps {
  showSidebar: boolean;
  onShowClicked: () => void;
  onHide: () => void;
}

export const AppSidebarContext = React.createContext<SideBarContextProps>({
  showSidebar: false,
  onShowClicked: () => null,
  onHide: () => null
});

export const AppSidebarConsumer = AppSidebarContext.Consumer;

export interface Props {
  client: ApolloClient<{}>;
}

export interface State {
  showSidebar: boolean;
  cacheLoaded?: boolean;
}
