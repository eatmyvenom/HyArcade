const { readFile, writeFile } = require("fs-extra");
const Logger = require("hyarcade-logger");

/**
 * 
 */
async function main () {
  let txtList = await readFile("data/guildtxt");
  txtList = txtList
    .toString()
    .trim()
    .split("\n");

  let guildList = await readFile("data/guildlist.json");
  guildList = JSON.parse(guildList.toString());

  const realGuilds = [...new Set(guildList.concat(txtList))];

  await writeFile("data/guildlist.json", JSON.stringify(realGuilds, null, "\t"));
}

main()
  .then(Logger.log)
  .catch(Logger.err);