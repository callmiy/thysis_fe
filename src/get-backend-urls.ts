const URL_ROOT = "/api";

export const getBackendUrls = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  if (!apiUrl) {
    throw new Error(
      'You must set the "REACT_APP_API_URL" environment variable'
    );
  }

  let websocketUrl;

  // if we are in production, we connect directly to the socket using relative uri
  if (apiUrl === URL_ROOT) {
    websocketUrl = "/socket";
  } else {
    const httpHostRegexExec = /https?/.exec(apiUrl);

    if (!httpHostRegexExec) {
      throw new Error("Invalid HTTP host in '" + apiUrl + "'");
    }

    const httpHost = httpHostRegexExec[0];
    const websocketHost = httpHost === "https" ? "wss" : "ws";

    websocketUrl = apiUrl
      .replace(httpHost, websocketHost)
      .replace(URL_ROOT, "/socket");
  }

  return {
    apiUrl,
    websocketUrl
  };
};

export default getBackendUrls;
