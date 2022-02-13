const { Client } = require("discord.js");
const fs = require("fs-extra");
const Database = require("hyarcade-requests/Database");
const Role = require("hyarcade-structures/Discord/Role");
const BotRuntime = require("../../BotRuntime");
const RoleUpdater = require("./RoleUpdater");

/**
 *
 * @param {Client} client
 */
module.exports = async function roleHandler(client) {
  const roleSet = await fs.readJSON("config.roles.json");
  const list = await BotRuntime.getFromDB("discordList");
  const disclist = {};

  for (const link of list) {
    disclist[link.discordID] = link.uuid;
  }

  const accs = await Database.getLinkedAccounts();

  for (const server in roleSet) {
    const guild = await client.guilds.fetch(server);

    for (const path in roleSet[server]) {
      const roleList = roleSet[server][path];
      const roles = [];

      for (const id in roleList) {
        roles.push(new Role(roleList[id], id));
      }

      const category = path.split(".")[0];
      const stat = path.split(".")[1];
      const updater = new RoleUpdater(guild, roles, category, stat);
      await updater.updateAll(disclist, accs);
    }
  }
};
