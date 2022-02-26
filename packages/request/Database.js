const Config = require("hyarcade-config");
const Logger = require("hyarcade-logger");
const { default: axios } = require("axios");

const cfg = Config.fromJSON();

/**
 * @param status
 * @returns {boolean}
 */
function validateStatus(status) {
  return status < 500;
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
      let fileReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      fileData = fileReq.data;
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

    await axios.post(url.toString(), json, { headers: { Authorization: cfg.database.pass }, validateStatus });
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
      Logger.verbose(`Fetching ${url.searchParams} from database!`);
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      acc = accReq.data;
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
      Logger.debug(`Fetching guild ${url.searchParams} from database!`);
      const guildReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      guild = guildReq.data;
    } catch (error) {
      Logger.err("Error fetching data from database");
      Logger.err(error.stack);
      Logger.err(guild);
      return {};
    }

    return guild;
  }

  static async timedAccount(text, discordID, time, cacheOnly = false) {
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

    if (time != undefined && time != "lifetime" && time != "life") {
      url.searchParams.set("time", time);
    }

    if (cacheOnly) {
      url.searchParams.set("cache", "");
    }

    let acc;
    try {
      Logger.debug(`Fetching ${url.searchParams} from database!`);
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      acc = accReq.data;
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
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      info = accReq.data;
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(info);
      return {};
    }

    return info;
  }

  static async addAccount(json) {
    Logger.verbose(`Adding ${json.name} to accounts in database`);
    const url = new URL("account", cfg.database.url);

    try {
      await axios.post(url.toString(), json, { headers: { Authorization: cfg.database.pass }, validateStatus });
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      return {};
    }
  }

  static async addGuild(json) {
    Logger.info(`Adding ${json.name} to guilds in database`);
    const url = new URL("guild", cfg.database.url);

    try {
      await axios.post(url.toString(), json, { headers: { Authorization: cfg.database.pass }, validateStatus });
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
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      disc = accReq.data;
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
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      disc = accReq.data;
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
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      hack = accReq.data;
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
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      hack = accReq.data;
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
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      hack = accReq.data;
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
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      ban = accReq.data;
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
      const lbReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      lb = lbReq.data;
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
      const lbReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      lb = lbReq.data;
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
      const req = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      discAccs = await req.data;
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(discAccs);
      return {};
    }

    return discAccs;
  }

  static async internal(json, auth = "") {
    const url = new URL("internal", cfg.database.url);

    let response;
    try {
      response = await axios.post(url.toString(), json, { headers: { Authorization: cfg.database.pass, key: auth } });
      response = response.data;
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      return {};
    }

    return response;
  }

  static async ping() {
    const url = new URL("ping", cfg.database.url);

    try {
      const testData = await axios.get(url.toString(), { timeout: 10000 });
      return testData.data.response == "pong";
    } catch {
      return false;
    }
  }

  static async status(text, discordID) {
    const url = new URL("status", cfg.database.url);

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

    let sts;
    try {
      Logger.verbose(`Fetching ${url.searchParams} from database!`);
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      sts = accReq.data;
    } catch (error) {
      Logger.err("Error fetching data from database");
      Logger.err(error.stack);
      Logger.err(sts);
      return {};
    }

    return sts;
  }

  static async gameCounts() {
    const url = new URL("gamecounts", cfg.database.url);

    let counts;
    try {
      const req = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      counts = req.data;
    } catch (error) {
      Logger.err("Can't connect to database");
      Logger.err(error.stack);
      Logger.err(counts);
      return {};
    }

    return counts;
  }

  static async friends(text, discordID) {
    const url = new URL("friends", cfg.database.url);

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

    let sts;
    try {
      Logger.verbose(`Fetching ${url.searchParams} from database!`);
      const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
      sts = accReq.data;
    } catch (error) {
      Logger.err("Error fetching data from database");
      Logger.err(error.stack);
      Logger.err(sts);
      return {};
    }

    return sts;
  }
};
