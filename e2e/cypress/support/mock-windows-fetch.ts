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

    increaseFetches();

    return fetch(fetchUrl, modifiedOptions)
      .then(result => {
        decreaseFetches();
        return Promise.resolve(result);
      })
      .catch(error => {
        decreaseFetches();
        return Promise.reject(error);
      });
  };
}

export default mockWindowsFetch;

function increaseFetches() {
  const count = Cypress.env("fetchCount") || 0;
  Cypress.env("fetchCount", count + 1);
}

function decreaseFetches() {
  const count = Cypress.env("fetchCount") || 0;
  Cypress.env("fetchCount", count === 0 ? 0 : count - 1);
}
