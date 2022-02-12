const { readFile, writeFile } = require("fs-extra");
const Logger = require("hyarcade-logger");

/**
 *
 */
async function main() {
  let txtList = await readFile("data/guildtxt");
  txtList = txtList.toString().trim().split("\n");

  let guildList = await readFile("data/guildlist.json");
  guildList = JSON.parse(guildList.toString());

  const realGuilds = [...new Set([...guildList, ...txtList])];

  await writeFile("data/guildlist.json", JSON.stringify(realGuilds, undefined, "\t"));
}

main()
  .then((...args) => Logger.log(...args))
  .catch(error => Logger.err(error.stack));
