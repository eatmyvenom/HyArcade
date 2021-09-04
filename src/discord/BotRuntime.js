const cfg = require("hyarcade-config").fromJSON();
const AdvancedEmbeds = require("./Utils/Embeds/AdvancedEmbeds");
const fetch = require("node-fetch");
const Logger = require("hyarcade-logger");
const { AccountArray } = require("hyarcade-requests").types;
const {
  MessageEmbed, Client, Message
} = require("discord.js");
const { readFile } = require("fs-extra");
const { logger } = require("../utils");
const Database = require("./Utils/Database");
const Account = require("hyarcade-requests/types/Account");
const { mojangRequest } = require("hyarcade-requests");

let hackerlist = null;
let blacklist = null;

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

  let acc;
  if(Database.accCache[uuid] != undefined) {
    acc = Database.accCache[uuid];
  } else {
    acc = new Account("", 0, `${uuid}`);
    await acc.updateData();
    Database.accCache[acc.uuid] = acc;
  }

  if(acc.name == "INVALID-NAME") {
    return undefined;
  }

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
     * @returns {Promise<Account>}
     */
    static async resolveAccount (str, rawMessage, canbeSelf = true) {
      if(BotRuntime.botMode == "mini") {
        return await getFromHypixel(str);
      }
    
      const url = new URL("account", cfg.dbUrl);
      const urlArgs = url.searchParams;
    
      if(str?.length == 32) {
        urlArgs.set("uuid", str.toLowerCase());
      } else if(str?.length == 36) {
        urlArgs.set("uuid", str.toLowerCase().replace(/-/g, ""));
      } else if(str?.length == 21 && str.startsWith("<@")) {
        urlArgs.set("discid", str.slice(2, -1));
      } else if(str?.length == 22 && str.startsWith("<!@")) {
        urlArgs.set("discid", str.slice(3, -1));
      } else if(str?.length == 18 && str.toUpperCase() == str.toLowerCase()) {
        urlArgs.set("discid", str);
      } else if(str != null && str != "null" && str != undefined && str != "!") {
        urlArgs.set("ign", str.toLowerCase());
      } else if (canbeSelf) {
        urlArgs.set("discid", rawMessage.author.id);
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
        const list = await readFile("data/blacklist");
        blacklist = list.toString().trim()
          .split("\n")
          .filter((v) => v != "");
        setTimeout(() => blacklist = null, 3600000);
      }
  
      return blacklist;
    }
};
