const { default: axios } = require("axios");
const Logger = require("@hyarcade/logger");
const addAccounts = require("../systems/datagen/addAccounts");

/**
 *
 */
async function main() {
  let uuids = [];

  const stats = ["xp", "chatMessages", "leftClicks", "kills", "playtime"];
  for (const stat of stats) {
    for (let page = 0; page < 20; page++) {
      const topPit = await axios.get(`https://pitpanda.rocks/api/leaderboard/${stat}?page=${page}`);
      const obj = topPit.data;
      uuids = [...obj.leaderboard.map(a => a.uuid), ...uuids];
    }
  }
  await addAccounts(uuids);
}

main()
  .then((...args) => Logger.log(...args))
  .catch(error => Logger.err(error.stack));
