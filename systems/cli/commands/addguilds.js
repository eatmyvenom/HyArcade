const { default: axios } = require("axios");
const { readFile, writeFile } = require("fs-extra");
const Logger = require("@hyarcade/logger");

/**
 * @param {string[]} args
 */
async function main(args) {
  Logger.name = "AddGuilds";
  const plrList = args.slice(2);
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

module.exports = main;
