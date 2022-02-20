const { CommandInteraction } = require("discord.js");
const cfg = require("hyarcade-config").fromJSON();
const Logger = require("hyarcade-logger");
const { Account } = require("hyarcade-structures");
const fetch = require("node-fetch");
const AccountResolver = require("./Utils/AccountResolver");
const BotRuntime = require("../BotRuntime");

module.exports = class InteractionUtils {
  /**
   * Get an account just purely from a uuid quickly
   *
   * @static
   * @param {string} uuid
   * @returns {Promise<Account>}
   */
  static async accFromUUID(uuid) {
    let acc;

    if (BotRuntime.botMode != "mini") {
      const url = new URL("account", cfg.database.url);
      const urlArgs = url.searchParams;

      urlArgs.set("uuid", uuid.toLowerCase());
      let accdata = await fetch(url.toString());
      if (accdata.status == 200) {
        accdata = await accdata.json();
        acc = accdata;
      }
    }

    if (acc == undefined) {
      acc = new Account("", 0, `${uuid}`);
      await acc.updateData();
    }

    return acc;
  }

  /**
   *
   * @param {CommandInteraction} interaction
   * @param {string} namearg
   * @param {string} time
   * @param {boolean} force
   * @returns {Account}
   * @deprecated
   */
  static async resolveAccount(interaction, namearg = "player", time, force) {
    Logger.warn("Using deprecated function 'resolveAccount'");
    return await AccountResolver(interaction, namearg, time, force);
  }
};
