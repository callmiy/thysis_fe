const URL_SOCKET = "/socket";

export const getBackendUrls = (apiUrl: string) => {
  if (!apiUrl) {
    throw new Error(
      'You must set the "REACT_APP_API_URL" environment variable'
    );
  }

  const url = new URL(apiUrl);

  return {
    apiUrl: url.href,
    websocketUrl: new URL(URL_SOCKET, url.origin).href.replace("http", "ws"),
    root: url.origin
  };
};

export default getBackendUrls;

export interface BackendUrls {
  apiUrl: string;
  websocketUrl: string;
  root: string;
}
