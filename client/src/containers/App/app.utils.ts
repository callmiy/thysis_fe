import * as React from "react";

export interface SideBarContextProps {
  showSidebar: boolean;
  minWidth600?: boolean;
  onShowClicked: () => void;
  onHide: () => void;
}

export const AppSidebarContext = React.createContext<SideBarContextProps>({
  showSidebar: false,
  onShowClicked: () => null,
  onHide: () => null
});

export const AppSidebarConsumer = AppSidebarContext.Consumer;

export interface State {
  showSidebar: boolean;
  cacheLoaded?: boolean;
}
