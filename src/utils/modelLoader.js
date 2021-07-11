/**
 * @param {*} url
 * https://discourse.threejs.org/t/most-simple-way-to-wait-loading-in-gltf-loader/13896
 */

export function modelLoader(loader, url) {
  return new Promise((resolve, reject) => {
    loader.load(url, (data) => resolve(data), null, reject);
  });
}
