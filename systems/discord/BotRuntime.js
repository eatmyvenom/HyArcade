const { MessageEmbed, Client } = require("discord.js");
const logger = require("@hyarcade/logger");
const Database = require("@hyarcade/requests/Database");
const AdvancedEmbeds = require("./Utils/Embeds/AdvancedEmbeds");
const fs = require("fs-extra");
const path = require("path");

let hackerlist;
let blacklist;
let banlist;

module.exports = class BotRuntime {
  static isBotInstance = false;
  /**
   *
   * @type {Client}
   * @static
   */
  static client;
  static botMode;
  static tus = [];

  static get trustedUsers() {
    return BotRuntime.tus;
  }

  static getWebhookObj(embed) {
    const embeds = embed == undefined ? [] : [embed];
    return {
      username: BotRuntime.client.user.username,
      avatarURL: BotRuntime.client.user.avatarURL({ format: "png" }),
      embeds,
    };
  }

  static async getStats(acc, game) {
    /**
     * @type {MessageEmbed}
     */
    const embed = await AdvancedEmbeds.getStats(acc, game, false);
    return embed;
  }

  static async getHackerlist() {
    if (hackerlist == undefined) {
      const list = await Database.readDB("hackerList");
      hackerlist = list.map(h => h.uuid);
      setTimeout(() => (hackerlist = undefined), 3600000);
    }

    return hackerlist;
  }

  static async getBlacklist() {
    if (blacklist == undefined) {
      // eslint-disable-next-line no-undef
      fs.readFile(path.join(__dirname, "../../", "data/blacklist"))
        .then(bl => (blacklist = bl.toString().split("\n")))
        .catch(error => logger.err(error.stack));

      setTimeout(() => (blacklist = undefined), 3600000);
      return [];
    }

    return blacklist;
  }

  static async getBanlist() {
    if (banlist == undefined) {
      const list = await Database.readDB("bannedList");
      banlist = list.map(h => h.uuid);
      setTimeout(() => (banlist = undefined), 3600000);
    }

    return banlist;
  }
};
