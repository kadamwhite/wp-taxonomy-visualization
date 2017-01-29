/* eslint-disable no-underscore-dangle */// Part of external API
import WPAPI from 'wpapi';

const api = WPAPI.site('http://website.loc/wp-json');

/**
 * Take a WPRequest instance and a method to run each time a new set of results
 * is returned
 *
 * @param {WPRequest} wpReq     A WPAPI request instance
 * @param {Function}  [batchCb] Callback function to call with each new batch
 * @returns {Promise} A promise that resolves to the full set of results
 */
export function all(wpReq, batchCb = function noop() {}) {
  return wpReq.then((response) => {
    batchCb(response);
    if (!(response._paging && response._paging.next)) {
      return response;
    }

    // Recurse
    return Promise.all([
      response,
      all(response._paging.next, batchCb),
    ]).then((responses) => {
      return responses.reduce((combined, resp) => combined.concat(resp), []);
    });
  });
}

export function getAllPosts(batchCb) {
  return all(api.posts(), batchCb);
}
