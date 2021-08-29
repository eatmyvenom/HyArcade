const cfg = require("hyarcade-config").fromJSON();
const AdvancedEmbeds = require("./Utils/Embeds/AdvancedEmbeds");
const AccountResolver = require("./Utils/AccountResolver");
const fetch = require("node-fetch");
const Logger = require("hyarcade-logger");
const { AccountArray } = require("hyarcade-requests").types;
const {
  MessageEmbed, Client
} = require("discord.js");

let hackerlist = null;
let blacklist = null;

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

    static get trustedUsers () {
      return BotRuntime.tus;
    }

    static async resolveAccount (string, rawMessage, canbeSelf = true) {
      return await AccountResolver(
        string,
        rawMessage,
        canbeSelf,
        await this.getFromDB("accounts"),
        await this.getFromDB("disclist")
      );
    }

    /**
     * 
     * @param {string} file 
     * @returns {object}
     */
    static async getFromDB (file) {
      let fileData;
      const url = new URL("db", cfg.dbUrl);
      const path = `${file}`;
      url.searchParams.set("path", path);
      Logger.debug(`Fetching ${url.searchParams.toString()} from database`);

      try {
        fileData = await (await fetch(url)).json();
      } catch (e) {
        Logger.err("Can't connect to database");
        Logger.err(e);
        return {};
      }
      Logger.debug("Data fetched!");

      if (file == "accounts" || file == "dayaccounts" || file == "monthlyaccounts" || file == "weeklyaccounts") {
        return AccountArray(fileData);
      }
      return fileData;
    }

    static async writeToDB (path, json) {
      const data = JSON.stringify(json);
      const url = new URL("db", cfg.dbUrl);
      url.searchParams.set("path", path);
      Logger.debug(`Writing to ${path} in database`);

      try {
        await fetch(url.toString(), {
          method: "post",
          body: data,
          headers: {
            "Content-Type": "application/json",
            Authorization: cfg.dbPass
          }
        });
      } catch (e) {
        Logger.err("Can't connect to database");
        Logger.err(e);
        return {};
      }
    }

    static getWebhookObj (embed) {
      let embeds;
      if(embed == undefined) {
        embeds = [];
      } else {
        embeds = [embed];
      }
      return {
        username: BotRuntime.client.user.username,
        avatarURL: BotRuntime.client.user.avatarURL({ format: "png" }),
        embeds,
      };
    }

    static async getStats (acc, game) {
      /**
       * @type {MessageEmbed}
       */
      const embed = await AdvancedEmbeds.getStats(
        acc,
        game,
        false
      );
      return embed;
    }

    static async getHackerlist () {
      if(hackerlist == null) {
        hackerlist = await BotRuntime.getFromDB("hackerlist");
        setTimeout(() => hackerlist = null, 3600000);
      }
  
      return hackerlist;
    }
  
    static async getBlacklist () {
      if(blacklist == null) {
        blacklist = BotRuntime.getFromDB("blacklist");
        setTimeout(() => blacklist = null, 3600000);
      }
  
      return blacklist;
    }
};
