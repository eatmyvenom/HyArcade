const MongoConnector = require("@hyarcade/requests/MongoConnector");

/**
 *
 * @param {string[]} args
 * @returns {*}
 */
async function main(args) {
  const c = new MongoConnector("mongodb://127.0.0.1:27017");

  await c.connect(false);
  await c.snapshotAccounts(args[3]);
}

module.exports = main;
