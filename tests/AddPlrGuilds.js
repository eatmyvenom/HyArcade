const { readFile, writeFile } = require("fs-extra");
const Logger = require("hyarcade-logger");
const { default: fetch } = require("node-fetch");

/**
 * 
 */
async function main () {
  Logger.name = "AddPlrGuilds";
  // eslint-disable-next-line no-undef
  const plrList = process.argv.slice(2);
  const newList = [];

  for(const plr of plrList) {
    const req = await fetch(`https://api.slothpixel.me/api/guilds/${plr}`);
    const guild = await req.json();

    newList.push(guild.id);
    Logger.info(`Adding guild "${guild.name}"`);
  }

  let guildList = await readFile("data/guildlist.json");
  guildList = JSON.parse(guildList.toString());

  const realGuilds = [...new Set(guildList.concat(newList))];

  await writeFile("data/guildlist.json", JSON.stringify(realGuilds, null, "\t"));
}

main()
  .then(Logger.log)
  .catch(Logger.err);