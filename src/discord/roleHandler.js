const Role = require("../classes/Role");
const RoleUpdater = require("./RoleUpdater");
const fs = require("fs-extra");
const BotRuntime = require("./BotRuntime");
const { Client } = require("discord.js");
const utils = require("../utils");

const neededStats = ["blockingDead",
  "name",
  "uuid",
  "discord",
  "hypixelDiscord",
  "bountyHunters",
  "dragonWars", 
  "enderSpleef", 
  "farmhunt", 
  "football", 
  "galaxyWars", 
  "hideAndSeek", 
  "holeInTheWall", 
  "hypixelSays", 
  "partyGames", 
  "pixelPainters", 
  "throwOut", 
  "miniWalls", 
  "seasonalWins",
  "easter",
  "scuba",
  "halloween",
  "grinch",
  "total",
  "simTotal",
  "wins",
  "kills",
];

/**
 * 
 * @param {Client} client 
 */
module.exports = async function roleHandler (client) {
  const roleSet = await fs.readJSON("config.roles.json");
  const disclist = await BotRuntime.getFromDB("disclist");
  const accs = await BotRuntime.getFromDB("accounts", neededStats);

  for(const server in roleSet) {
    const guild = await client.guilds.fetch(server);

    for(const path in roleSet[server]) {
      const roleList = roleSet[server][path];
      const roles = [];
      for(const id in roleList) {
        roles.push(new Role(roleList[id], id));
      }
      const category = path.split(".")[0];
      const stat = path.split(".")[1];
      const updater = new RoleUpdater(guild, roles, category, stat);
      await updater.updateAll(disclist, accs);
    }
  }

  const tags = {};

  accs.forEach((acc) => {
    const usr = client.users.cache.find((u) => u.id == acc.discid);

    if(usr) {
      tags[acc.uuid] = usr.tag;
    }
  });

  await utils.writeJSON("tags.json", tags);
};
