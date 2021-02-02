import { ZEPLIN_TOKEN_STORAGE_KEY } from "../constants";

function getHeaders() {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  const zeplinToken = localStorage.getItem("zeplinToken");
  if (zeplinToken) {
    headers.set("Authorization", `Bearer ${zeplinToken}`);
  }

  return headers;
}

export function handleResponse(response) {
  return response.json().then((resJson) => {
    if (response.ok) {
      return resJson;
    }

    if (
      resJson.message === "token_expired" ||
      resJson.message === "invalid_token"
    ) {
      localStorage.removeItem(ZEPLIN_TOKEN_STORAGE_KEY);

      window.location = "/";
    }

    // TODO: show modal for errors
    throw new Error(resJson.message);
  });
}

const http = {
  /**
   * Sends a get request with Zeplin headers.
   * @param {String} url
   * @param {Object} options additional fetch options
   */
  get(url, options = {}) {
    return fetch(url, { headers: getHeaders(), ...options });
  },

  /**
   * Sends a post request with Zeplin headers.
   * @param {String} url
   * @param {Object} body
   */
  post(url, body) {
    const args = {
      headers: getHeaders(),
      method: "POST",
    };

    if (body) {
      Object.assign(args, { body: JSON.stringify(body) });
    }

    return fetch(url, args);
  },

  /**
   *  Sends a put request with Zeplin headers
   * @param {String} url
   * @param {Object} body
   */
  put(url, body) {
    const args = {
      headers: getHeaders(),
      method: "PUT",
    };

    if (body) {
      Object.assign(args, { body: JSON.stringify(body) });
    }

    return fetch(url, args);
  },

  /**
   * Sends a delete request with Zeplin headers
   * @param {String} url
   * @param {Object} body
   */
  delete(url, body) {
    const args = {
      headers: getHeaders(),
      method: "DELETE",
    };

    if (body) {
      Object.assign(args, { body: JSON.stringify(body) });
    }

    return fetch(url, args);
  },
};

export default http;
