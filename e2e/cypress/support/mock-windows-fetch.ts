type Fetch = (
  input: RequestInfo,
  init?: RequestInit | undefined
) => Promise<Response>;

export function mockWindowsFetch(fetch: Fetch) {
  return function(fetchUrl: RequestInfo, fetchOptions?: RequestInit) {
    let headers;

    if (fetchOptions) {
      headers = fetchOptions.headers;
    } else {
      headers = {};
    }

    const modifiedHeaders = Object.assign(
      { "x-session-id": Cypress.env("sessionId") },
      headers
    );

    const modifiedOptions = Object.assign({}, fetchOptions, {
      headers: modifiedHeaders
    });

    return fetch(fetchUrl, modifiedOptions);
  };
}

export default mockWindowsFetch;
