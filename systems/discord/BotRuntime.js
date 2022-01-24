const cfg = require("hyarcade-config").fromJSON();
const AdvancedEmbeds = require("./Utils/Embeds/AdvancedEmbeds");
const fetch = require("node-fetch");
const { AccountArray } = require("hyarcade-requests").types;
const { MessageEmbed, Client, Message } = require("discord.js");
const logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const Account = require("hyarcade-requests/types/Account");
const { mojangRequest } = require("hyarcade-requests");

let hackerlist = null;
let blacklist = null;
let banlist = null;

/**
 * 
 * @param {string} string 
 * @returns {Promise<Account>}
 */
async function getFromHypixel (string) {
  logger.info("Unable to resolve, getting by ign from hypixel.");

  const plr = string;
  let uuid;
  if(plr?.length > 17) {
    uuid = plr;
  } else {
    uuid = await mojangRequest.getUUID(plr);
  }

  const acc = new Account("", 0, `${uuid}`);
  await acc.updateData();

  if(acc.name == "INVALID-NAME" || acc.name == undefined) {
    return undefined;
  }

  await Database.addAccount(acc);
  return acc;
}

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

    /**
     * 
     * @param {string} str 
     * @param {Message} rawMessage 
     * @param {boolean} canbeSelf 
     * @param {string} time
     * @param {boolean} force
     * @returns {Promise<Account>}
     * @deprecated
     */
    static async resolveAccount (str, rawMessage, canbeSelf = true, time = "lifetime", force = false) {
      logger.warn("Using deprecated function 'resolveAccount'");
      let url;
      if (time != "lifetime") {
        url = new URL("timeacc", cfg.dbUrl);
      } else {
        url = new URL("account", cfg.dbUrl);
      }

      const urlArgs = url.searchParams;
    
      if(str?.length == 32) {
        if(force && time == "lifetime") return await getFromHypixel(str);
        urlArgs.set("uuid", str.toLowerCase());
      } else if(str?.length == 36) {
        if(force && time == "lifetime") return await getFromHypixel(str);
        urlArgs.set("uuid", str.toLowerCase().replace(/-/g, ""));
      } else if(str?.length == 21 && str.startsWith("<@")) {
        urlArgs.set("discid", str.slice(2, -1));
      } else if(str?.length == 22 && str.startsWith("<!@")) {
        urlArgs.set("discid", str.slice(3, -1));
      } else if(str?.length == 18 && str.toUpperCase() == str.toLowerCase()) {
        urlArgs.set("discid", str);
      } else if(str != null && str != "null" && str != "" && str != undefined && str != "!") {
        if(force && time == "lifetime") return await getFromHypixel(str);
        urlArgs.set("ign", str.toLowerCase());
      } else if (canbeSelf) {
        urlArgs.set("discid", rawMessage?.author?.id ?? "");
      }

      if (time != "lifetime") {
        urlArgs.set("time", time);
      }
    
      logger.debug(`Fetching ${url.searchParams.toString()} from database`);
      let accdata = await fetch(url.toString());
      if(accdata.status == 200) {
        accdata = await accdata.json();
        if(accdata.name == "INVALID-NAME" || accdata.name == "null") {
          return undefined;
        }
        return accdata;
      }
    
      if(str != null) {
        return await getFromHypixel(str);
      }
    
      return undefined;
    }

    /**
     * 
     * @param {string} file 
     * @param {string[]} fields
     * @returns {object}
     */
    static async getFromDB (file, fields) {
      const fileData = await Database.readDB(file, fields);

      if (file == "accounts" || file == "dayaccounts" || file == "monthlyaccounts" || file == "weeklyaccounts") {
        return AccountArray(fileData);
      }
      return fileData;
    }

    static async writeToDB (path, json) {
      await Database.writeDB(path, json);
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
        BotRuntime.getFromDB("blacklist")
          .then((bl) => blacklist = bl)
          .catch(logger.err);

        setTimeout(() => blacklist = null, 3600000);
        return [];
      }
  
      return blacklist;
    }

    static async getBanlist () {
      if(banlist == null) {
        banlist = await BotRuntime.getFromDB("banlist");
        setTimeout(() => banlist = null, 3600000);
      }

      return banlist;
    }
};