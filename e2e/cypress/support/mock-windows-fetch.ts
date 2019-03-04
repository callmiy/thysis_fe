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

    return fetch(fetchUrl, modifiedOptions)
      .then(result => {
        return Promise.resolve(result);
      })
      .catch(error => {
        // tslint:disable-next-line:no-console
        console.log(
          "\n\t\tLogging start\n\n\n\n  fetch error\n",
          error,
          "\n\n\n\n\t\tLogging ends\n"
        );

        return Promise.reject(error);
      });
  };
}

export default mockWindowsFetch;
