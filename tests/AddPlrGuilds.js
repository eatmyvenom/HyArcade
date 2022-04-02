const { default: axios } = require("axios");
const { readFile, writeFile } = require("fs-extra");
const Logger = require("@hyarcade/logger");

/**
 *
 */
async function main() {
  Logger.name = "AddPlrGuilds";
  // eslint-disable-next-line no-undef
  const plrList = process.argv.slice(2);
  const newList = [];

  for (const plr of plrList) {
    const req = await axios.get(`https://api.slothpixel.me/api/guilds/${plr}`);
    const guild = await req.data;

    newList.push(guild.id);
    Logger.info(`Adding guild "${guild.name}"`);
  }

  let guildList = await readFile("data/guildlist.json");
  guildList = JSON.parse(guildList.toString());

  const realGuilds = [...new Set([...guildList, ...newList])];

  await writeFile("data/guildlist.json", JSON.stringify(realGuilds, undefined, "\t"));
}

main()
  .then((...args) => Logger.log(...args))
  .catch(error => Logger.err(error.stack));
