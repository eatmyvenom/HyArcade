const http = require("http");
const https = require("https");
const { parseChunked, stringifyStream } = require("@discoveryjs/json-ext");
const Config = require("hyarcade-config");
const Logger = require("hyarcade-logger");
const { default: fetch } = require("node-fetch");
const webRequest = require("./webRequest");

const cfg = Config.fromJSON();

/**
 * Read JSON data as a stream from a url
 * This is used as a stream due to the the string length limitations of nodejs/v8
 *
 *
 * @param {URL} url
 */
function readJSONStream(url) {
  let reqModule;
  reqModule = url.protocol == "https:" ? https : http;

  return new Promise((resolve, rejects) => {
    reqModule.get(url, { headers: { Authorization: cfg.database.pass } }, res => {
      parseChunked(res).then(resolve).catch(rejects);
    });
  });
}

/**
 * Write JSON data as a stream to a url
 * This is used as a stream due to the the string length limitations of nodejs/v8
 *
 *
 * @param {URL} url
 * @param {*} obj
 * @returns {Promise<any>}
 */
function writeJSONStream(url, obj) {
  let reqModule;
  reqModule = url.protocol == "https:" ? https : http;

  return new Promise((resolve, reject) => {
    const req = reqModule.request(url, { headers: { Authorization: cfg.database.pass }, method: "POST" });

    stringifyStream(obj).on("error", reject).pipe(req).on("error", reject).on("finish", resolve);
  });
}

module.exports = class Database {
  static async readDB(file, fields) {
    let fileData;
    const url = new URL("db", cfg.database.url);
    const path = `${file}`;
    url.searchParams.set("path", path);

    if (fields != undefined) {
      url.searchParams.set("fields", fields.join(","));
    }

    Logger.debug(`Fetching ${url.searchParams.toString()} from database`);

    try {
      fileData = await readJSONStream(url);
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      return {};
    }
    Logger.debug("Data fetched!");
    return fileData;
  }

  static async writeDB(path, json) {
    const url = new URL("db", cfg.database.url);
    url.searchParams.set("path", path);
    Logger.debug(`Writing to ${path} in database`);

    await writeJSONStream(url, json);
  }

  static async account(text, discordID, cacheOnly = false) {
    const url = new URL("account", cfg.database.url);

    if (text != undefined && text != "" && text != "!") {
      if (text.length < 17) {
        url.searchParams.set("ign", text);
      } else {
        url.searchParams.set("uuid", text.replace(/-/g, ""));
      }
    }

    if (discordID != undefined && discordID != "") {
      url.searchParams.set("discid", discordID);
    }

    if (cacheOnly) {
      url.searchParams.set("cache", "");
    }

    let acc;
    try {
      Logger.debug(`Fetching ${url.searchParams} from database!`);
      const accReq = await webRequest(url.toString());
      acc = await JSON.parse(accReq.data);
    } catch (error) {
      Logger.err("Error fetching data from database");
      Logger.err(error.stack);
      Logger.err(acc);
      return {};
    }

    return acc;
  }

  static async guild(text) {
    const url = new URL("guild", cfg.database.url);

    if (text != undefined && text != "" && text != "!") {
      if (text.length == 24) {
        url.searchParams.set("uuid", text);
      } else {
        url.searchParams.set("member", text.replace(/-/g, ""));
      }
    }

    let guild;
    try {
      Logger.debug(`Fetching ${url.searchParams} from database!`);
      const guildReq = await webRequest(url.toString());
      guild = await JSON.parse(guildReq.data);
    } catch (error) {
      Logger.err("Error fetching data from database");
      Logger.err(error.stack);
      Logger.err(guild);
      return {};
    }

    return guild;
  }

  static async timedAccount(text, discordID, time, cacheOnly = false) {
    const url = new URL("timeacc", cfg.database.url);

    if (text != undefined && text != "" && text != "!") {
      if (text.length < 17) {
        url.searchParams.set("ign", text);
      } else {
        url.searchParams.set("uuid", text.replace(/-/g, ""));
      }
    }

    if (discordID != undefined && discordID != "") {
      url.searchParams.set("discid", discordID);
    }

    if (time != undefined && time != "lifetime" && time != "life") {
      url.searchParams.set("time", time);
    }

    if (cacheOnly) {
      url.searchParams.set("cache", "");
    }

    let acc;
    try {
      Logger.debug(`Fetching ${url.searchParams} from database!`);
      const accReq = await webRequest(url.toString());
      acc = await JSON.parse(accReq.data);
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(acc);
      return {};
    }

    return acc;
  }

  static async info() {
    const url = new URL("info", cfg.database.url);

    let info;
    try {
      const accReq = await webRequest(url.toString());
      info = await JSON.parse(accReq.data);
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(info);
      return {};
    }

    return info;
  }

  static async addAccount(json) {
    Logger.info(`Adding ${json.name} to accounts in database`);
    const data = JSON.stringify(json);
    const url = new URL("account", cfg.database.url);

    try {
      await fetch(url.toString(), {
        method: "post",
        body: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: cfg.database.pass,
        },
      });
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      return {};
    }
  }

  static async addGuild(json) {
    Logger.info(`Adding ${json.name} to guilds in database`);
    const data = JSON.stringify(json);
    const url = new URL("guild", cfg.database.url);

    try {
      await fetch(url.toString(), {
        method: "post",
        body: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: cfg.database.pass,
        },
      });
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      return {};
    }
  }

  static async linkDiscord(id, uuid) {
    const url = new URL("disc", cfg.database.url);

    if (id != undefined && id != "") {
      url.searchParams.set("id", id);
    }

    if (uuid != undefined) {
      url.searchParams.set("uuid", uuid);
    }

    url.searchParams.set("action", "ln");

    let disc;
    try {
      const accReq = await fetch(url.toString(), {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: cfg.database.pass,
        },
      });
      disc = await accReq.json();
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(disc);
      return {};
    }

    return disc;
  }

  static async unlinkDiscord(id, uuid) {
    const url = new URL("disc", cfg.database.url);

    if (id != undefined && id != "") {
      url.searchParams.set("id", id);
    }

    if (uuid != undefined) {
      url.searchParams.set("uuid", uuid);
    }

    url.searchParams.set("action", "rm");

    let disc;
    try {
      const accReq = await fetch(url.toString(), {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: cfg.database.pass,
        },
      });
      disc = await accReq.json();
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(disc);
      return {};
    }

    return disc;
  }

  static async addHacker(uuid) {
    const url = new URL("hacker", cfg.database.url);

    if (uuid != undefined) {
      url.searchParams.set("uuid", uuid);
    }

    url.searchParams.set("action", "add");

    let hack;
    try {
      const accReq = await fetch(url.toString(), {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: cfg.database.pass,
        },
      });
      hack = await accReq.json();
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(hack);
      return {};
    }

    return hack;
  }

  static async delHacker(uuid) {
    const url = new URL("hacker", cfg.database.url);

    if (uuid != undefined) {
      url.searchParams.set("uuid", uuid);
    }

    url.searchParams.set("action", "del");

    let hack;
    try {
      const accReq = await fetch(url.toString(), {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: cfg.database.pass,
        },
      });
      hack = await accReq.json();
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(hack);
      return {};
    }

    return hack;
  }

  static async addBanned(uuid) {
    const url = new URL("banned", cfg.database.url);

    if (uuid != undefined) {
      url.searchParams.set("uuid", uuid);
    }

    url.searchParams.set("action", "add");

    let hack;
    try {
      const accReq = await fetch(url.toString(), {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: cfg.database.pass,
        },
      });
      hack = await accReq.json();
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(hack);
      return {};
    }

    return hack;
  }

  static async delBanned(uuid) {
    const url = new URL("banned", cfg.database.url);

    if (uuid != undefined) {
      url.searchParams.set("uuid", uuid);
    }

    url.searchParams.set("action", "del");

    let ban;
    try {
      const accReq = await fetch(url.toString(), {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: cfg.database.pass,
        },
      });
      ban = await accReq.json();
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(ban);
      return {};
    }

    return ban;
  }

  static async getLeaderboard(path, category, time, min, reverse, max) {
    Logger.verbose("Reading database");

    const url = new URL("lb", cfg.database.url);
    url.searchParams.set("path", path);

    if (category != undefined && category != "undefined") {
      url.searchParams.set("category", category);
    }

    if (time != undefined) {
      url.searchParams.set("time", time);
    }

    if (max != undefined) {
      url.searchParams.set("max", max);
    }

    if (min) {
      url.searchParams.set("min", "");
    }

    if (reverse) {
      url.searchParams.set("reverse", "");
    }

    let lb;

    Logger.debug(`Fetching ${time ?? "lifetime"} ${category ?? ""} ${path} leaderboard`);
    try {
      const lbReq = await webRequest(url.toString());
      lb = await JSON.parse(lbReq.data);
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(lb);
      return {};
    }

    return lb;
  }

  static async getMWLeaderboard(stat, time) {
    Logger.info(`Fetching miniwalls ${stat} leaderboard from!`);

    const url = new URL("mwlb", cfg.database.url);
    url.searchParams.set("stat", stat);

    if (time != undefined) {
      url.searchParams.set("time", time);
    }

    let lb;

    try {
      const lbReq = await webRequest(url.toString());
      lb = await JSON.parse(lbReq.data);
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(lb);
      return {};
    }

    return lb;
  }

  static async getLinkedAccounts() {
    const url = new URL("disc", cfg.database.url);

    url.searchParams.set("action", "ls");

    let discAccs;
    try {
      const accs = await fetch(url.toString(), {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: cfg.database.pass,
        },
      });
      discAccs = await accs.json();
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(discAccs);
      return {};
    }

    return discAccs;
  }
};
