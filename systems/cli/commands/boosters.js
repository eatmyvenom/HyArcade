const { writeJson } = require("fs-extra");
const { HypixelApi, Database } = require("@hyarcade/requests");

/**
 */
async function main() {
  const networkBoosters = await HypixelApi.boosters();
  const gamesAPI = Database.Resource("games");
  const games = Object.values(gamesAPI.games);

  let boosters = networkBoosters.boosters.filter(b => b.length < b.originalLength);

  for (const b of boosters) {
    b.game = games.find(g => g.id == b.gameType).name;
    const acc = await Database.account(b.purchaserUuid);
    b.igns = [acc.name];

    if (Array.isArray(b.stacked)) {
      for (const uuid of b.stacked) {
        const stackAcc = await Database.account(uuid.replace(/-/g, ""));
        b.igns.push(stackAcc.name);
      }
    }
  }

  await writeJson("data/boosters.json", boosters, { spaces: 2 });
}

module.exports = main;
