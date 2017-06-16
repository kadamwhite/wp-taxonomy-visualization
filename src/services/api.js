/* eslint-disable no-underscore-dangle */// Part of external API
import WPAPI from 'wpapi';

const api = WPAPI.site('http://website.loc/wp-json');

function flatten(arrOfArrs) {
  return arrOfArrs.reduce((combined, arr) => combined.concat(arr), []);
}

function noop() {}

/**
 * Take a WPRequest instance and a method to run each time a new set of results
 * is returned
 *
 * @param {WPRequest} wpReq     A WPAPI request instance
 * @param {Function}  [batchCb] Callback function to call with each new batch
 * @returns {Promise} A promise that resolves to the full set of results
 */
export function all(wpReq, batchCb = noop) {
  return wpReq.then((response) => {
    batchCb(response);

    if (!(response._paging && response._paging.next)) {
      return response;
    }

    // Recurse
    return Promise.all([
      response,
      all(response._paging.next, batchCb),
    ])
      .then(responses => flatten(responses));
  });
}

// eslint-disable-next-line no-unused-vars
function getAllInParallel(resourceFactory, perRequest, perBatch, batchCb = noop) {
  // Make a new request using the provided factory method
  return resourceFactory()
    .perPage(perRequest)
    .headers()
    .then((headers) => {
      // Create an integer array of all valid pages, then split into batches
      // based on the perBatch count provided in arguments
      const pages = Array.from({
        length: headers['x-wp-totalpages'],
      }, (v, i) => i + 1);
      const batches = [];
      for (let i = 0; i < pages.length; i += perBatch) {
        batches.push(pages.slice(i, i + perBatch));
      }

      // Iterate through the batches, requesting all pages in each batch in
      // parallel and calling batchCb on each individual batch
      return batches.reduce((lastBatch, batch) => lastBatch.then((combined) => {
        return Promise.all(batch.map(page => resourceFactory().page(page).get()))
          .then((results) => {
            const batchPosts = flatten(results);
            batchCb(batchPosts);
            return combined.concat(batchPosts);
          });
      }), Promise.resolve([]));
    });
}

export function getAllPosts(batchCb) {
  return all(api.posts().perPage(5), batchCb);
  // return getAllInParallel(() => api.posts(), 10, 5, batchCb);
}

export function getAllCategories(batchCb) {
  return all(api.categories().perPage(5), batchCb);
  // return getAllInParallel(() => api.categories(), 10, 5, batchCb);
}

export function getAllTags(batchCb) {
  return all(api.tags().perPage(5), batchCb);
  // return getAllInParallel(() => api.tags(), 10, 5, batchCb);
}

export function getAllContent(onPostBatch, onTermBatch) {
  return Promise.all([
    api.types(),
    api.taxonomies(),
  ]).then(([types, taxonomies]) => {
    const getAllObjects = Object.keys(types).reduce((lastProm, key) => lastProm.then(() => {
      const type = types[key];
      if (!type.taxonomies.length) {
        // We only care about taxonomy-related objects
        return;
      }
      const factory = api.registerRoute('wp/v2', `/${type.rest_base}`).bind(api);
      return all(factory().perPage(20), (batch) => {
        const typedObjects = batch.map(obj => Object.assign(obj, {
          type: type.slug
        }));
        onPostBatch(typedObjects);
      });
    }), Promise.resolve());

    const getAllTerms = Object.keys(taxonomies).reduce((lastProm, key) => lastProm.then(() => {
      const tax = taxonomies[key];
      const factory = api.registerRoute('wp/v2', `/${tax.rest_base}`).bind(api);
      return all(factory().perPage(20), (batch) => {
        const typedTerms = batch.map(term => Object.assign(term, {
          type: tax.slug
        }));
        onTermBatch(typedTerms)
      });
    }), Promise.resolve());

    return Promise.all([getAllObjects, getAllTerms]);
  });
}
