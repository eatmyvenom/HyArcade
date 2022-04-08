const logger = require("@hyarcade/logger");
const Database = require("@hyarcade/database");
const fs = require("fs-extra");
const path = require("path");

let hackerlist;
let blacklist;
let banlist;

module.exports = {
  isBotInstance: false,
  client: undefined,
  botMode: undefined,
  tus: [],
  get trustedUsers() {
    return this.tus;
  },
  getWebhookObj(embed) {
    const embeds = embed == undefined ? [] : [embed];
    return {
      username: this.client.user.username,
      avatarURL: this.client.user.avatarURL({ format: "png" }),
      embeds,
    };
  },
  async getHackerlist() {
    if (hackerlist == undefined) {
      const list = await Database.readDB("hackerList");
      hackerlist = list.map(h => h.uuid);
      setTimeout(() => (hackerlist = undefined), 3600000);
    }

    return hackerlist;
  },
  async getBlacklist() {
    if (blacklist == undefined) {
      // eslint-disable-next-line no-undef
      fs.readFile(path.join(__dirname, "../../", "data/blacklist"))
        .then(bl => (blacklist = bl.toString().split("\n")))
        .catch(error => logger.err(error.stack));

      setTimeout(() => (blacklist = undefined), 3600000);
      return [];
    }

    return blacklist;
  },
  async getBanlist() {
    if (banlist == undefined) {
      const list = await Database.readDB("bannedList");
      banlist = list.map(h => h.uuid);
      setTimeout(() => (banlist = undefined), 3600000);
    }

    return banlist;
  },
};
