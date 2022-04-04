const MongoConnector = require("@hyarcade/requests/MongoConnector");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  const c = new MongoConnector();

  await c.connect(false);
  await c.snapshotAccounts(args[3]);
}

module.exports = main;
