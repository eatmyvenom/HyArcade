const Role = require("../classes/Role");
const RoleUpdater = require("./RoleUpdater");
const logger = require("hyarcade-logger");
const fs = require("fs-extra");
const BotRuntime = require("./BotRuntime");

module.exports = async function roleHandler (client) {
  const roleSet = await fs.readJSON("config.roles.json");
  const disclist = await BotRuntime.getFromDB("disclist");
  const acclist = await BotRuntime.getFromDB("accounts");

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
      await updater.updateAll(disclist, acclist);
    }
  }

  logger.out("Roles updated");
};
