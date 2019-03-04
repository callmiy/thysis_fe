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

export enum MediaQueryKey {
  SCREEN_MIN_WIDTH_600 = "screenMinWidth600"
}

export const mediaQueries = {
  [MediaQueryKey.SCREEN_MIN_WIDTH_600]: "screen and (min-width: 600px)"
};

type StateMediaQueries = { [k in MediaQueryKey]: boolean };

export interface State {
  showSidebar: boolean;
  cacheLoaded?: boolean;
  mediaQueries: StateMediaQueries;
}

export const initialState: State = {
  showSidebar: false,
  mediaQueries: Object.values(MediaQueryKey).reduce(
    (acc, k) => ({ ...acc, [k]: false }),
    {} as StateMediaQueries
  )
};
