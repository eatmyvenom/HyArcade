const { default: axios } = require("axios");
const Logger = require("@hyarcade/logger");
const addAccounts = require("../src/datagen/addAccounts");

/**
 *
 */
async function main() {
  const topAP = await axios.get("https://notifly.zone/api/achievements/leaderboards/arcade");
  const obj = topAP.data;

  const uuids = obj.data.map(a => a.uuid);

  addAccounts(uuids);
}

main()
  .then((...args) => Logger.log(...args))
  .catch(error => Logger.err(error.stack));
