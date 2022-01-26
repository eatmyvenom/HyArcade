const connector = require("hyarcade-requests/MongoConnector");

/**
 * @param {string[]} args
 */
async function main(args) {
  const c = new connector("mongodb://127.0.0.1:27017");
  await c.connect();

  const lb = await c.getLeaderboard(args[4], args[5], args[6], args[7], args[8]);

  lb.map((acc) => `${acc.rank.replace(/_PLUS/g, "+")}`);

  await c.destroy();
}

module.exports = main;