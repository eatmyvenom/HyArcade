const config = require("hyarcade-config").fromJSON();
const cluster = require("../../src/cluster/cluster");

/**
 *
 * @returns {*}
 */
async function main() {
  const cstr = new cluster(config.cluster);
  await cstr.doTasks();
  await cstr.uploadData();
}

module.exports = main;
