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
      timeacc: await importNew("account.js"),
      timeaccount: await importNew("account.js"),
      acctimed: await importNew("account.js"),
      leaderboard: await importNew("leaderboard.js"),
      lb: await importNew("leaderboard.js"),
      db: await importNew("Database.js"),
      database: await importNew("Database.js"),
      mwlb: await importNew("MiniWallsLeaderboard.js"),
      miniwalls: await importNew("MiniWallsLeaderboard.js"),
      guildleaderboard: await importNew("GuildLeaderboard.js"),
      info: await importNew("info.js"),
      ping: await importNew("ping.js"),
      status: await importNew("Status.js"),
      friends: await importNew("Friends.js"),
      achievements: await importNew("Achievements.js"),
      gamecounts: await importNew("GameCounts.js"),
      guild: await importNew("guild.js"),
      internal: await importNew("internal.js"),
      hypixelresource: await importNew("HypixelResource.js"),
      "": await importNew("redoc.js"),
    };
  }
}

module.exports = EndpointStorage;
