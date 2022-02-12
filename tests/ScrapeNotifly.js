const Logger = require("hyarcade-logger");
const webRequest = require("hyarcade-requests/webRequest");
const addAccounts = require("../src/datagen/addAccounts");

/**
 *
 */
async function main() {
  const topAP = await webRequest("https://notifly.zone/api/achievements/leaderboards/arcade");
  const obj = JSON.parse(topAP.data);

  const uuids = obj.data.map(a => a.uuid);

  addAccounts(uuids);
}

main()
  .then((...args) => Logger.log(...args))
  .catch(error => Logger.err(error.stack));
