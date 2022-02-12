const Logger = require("hyarcade-logger");
const webRequest = require("hyarcade-requests/webRequest");
const addAccounts = require("../systems/datagen/addAccounts");

/**
 *
 */
async function main() {
  let uuids = [];

  const stats = ["xp", "chatMessages", "leftClicks", "kills", "playtime"];
  for (const stat of stats) {
    for (let page = 0; page < 20; page++) {
      const topPit = await webRequest(`https://pitpanda.rocks/api/leaderboard/${stat}?page=${page}`);
      const obj = JSON.parse(topPit.data);
      uuids = [...obj.leaderboard.map(a => a.uuid), ...uuids];
    }
  }
  await addAccounts(uuids);
}

main()
  .then((...args) => Logger.log(...args))
  .catch(error => Logger.err(error.stack));
