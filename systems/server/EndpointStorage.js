/**
 * @param {string} mod
 * @returns {Promise}
 */
async function importNew(mod) {
  const importedMod = await import(`./endpoints/${mod}?time=${Date.now()}`);
  return importedMod.default;
}

class EndpointStorage {
  all = {};
  initialized = false;

  async loadAll() {
    this.initialized = true;
    this.all = {
      account: await importNew("account.js"),
      acc: await importNew("account.js"),
      leaderboard: await importNew("leaderboard.js"),
      lb: await importNew("leaderboard.js"),
      db: await importNew("Database.js"),
      database: await importNew("Database.js"),
      mwlb: await importNew("MiniWallsLeaderboard.js"),
      miniwalls: await importNew("MiniWallsLeaderboard.js"),
      timeacc: await importNew("TimeAcc.js"),
      timeaccount: await importNew("TimeAcc.js"),
      acctimed: await importNew("TimeAcc.js"),
      info: await importNew("info.js"),
      ping: await importNew("ping.js"),
      disc: await importNew("disc.js"),
      guild: await importNew("guild.js"),
      hacker: await importNew("hacker.js"),
      banned: await importNew("banned.js"),
      internal: await importNew("internal.js"),
    };
  }
}

module.exports = EndpointStorage;
