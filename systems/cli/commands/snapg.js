const MongoConnector = require("@hyarcade/requests/MongoConnector");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  const c = new MongoConnector();

  await c.connect(false);
  await c.snapshotGuilds(args[3]);
}

module.exports = main;
