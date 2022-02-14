const fs = require("fs-extra");

/**
 *
 * @param {string} path
 * @returns {object}
 */
async function read(path) {
  return JSON.parse(await fs.readFile(`data/${path}`));
}

/**
 * Write json data to a file
 *
 * @param {string} path path of the target file
 * @param {object} json the json data
 */
async function write(path, json) {
  await (Array.isArray(json)
    ? fs.writeFile(`data/${path}`, `[${json.map(acc => JSON.stringify(acc)).join(",")}]`)
    : fs.writeFile(`data/${path}`, JSON.stringify(json, undefined, 4)));
}

module.exports = { read, write };
