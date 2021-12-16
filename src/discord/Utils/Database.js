const Logger = require("hyarcade-logger");
const fetch = require("node-fetch");
const cfg = require("hyarcade-config").fromJSON();

let cacheClear;

class Database {

  static accCache = {};

  static async addAccount (json) {
    cacheClear = setInterval(() => Database.accCache = {}, 30000);
    const data = JSON.stringify(json);
    const url = new URL("account", cfg.dbUrl);
    Logger.info(`Adding ${data.name} to accounts in database`);

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
      Logger.err(e.stack);
      return {};
    }
  }

  static async getLeaderboard (path, category, time, min, reverse, max) {
    Logger.verbose("Reading database");
    cacheClear = setInterval(() => Database.accCache = {}, 30000);
    const url = new URL("lb", cfg.dbUrl);
    url.searchParams.set("path", path) ;
    
    if(category != undefined && category != "undefined") {
      url.searchParams.set("category", category);
    }

    if(time != undefined) {
      url.searchParams.set("time", time);
    }

    if(max != undefined) {
      url.searchParams.set("max", max);
    }

    if(min) {
      url.searchParams.set("min", "");
    }

    if(reverse) {
      url.searchParams.set("reverse", "");
    }

    let lb;

    try {
      lb = await (await fetch(url)).json();
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e.stack);
      Logger.err(lb);
      return {};
    }

    return lb;
  }

  static async getMWLeaderboard (stat, time) {
    cacheClear = setInterval(() => Database.accCache = {}, 30000);
    const url = new URL("mwlb", cfg.dbUrl);
    url.searchParams.set("stat", stat);

    if(time != undefined) {
      url.searchParams.set("time", time);
    }

    let lb;

    try {
      lb = await (await fetch(url)).json();
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e.stack);
      Logger.err(lb);
      return {};
    }

    return lb;
  }

  static async timedAccount (ign, uuid, discordID, time) {
    cacheClear = setInterval(() => Database.accCache = {}, 30000);
    const url = new URL("timeacc", cfg.dbUrl);

    if(ign != undefined) {
      url.searchParams.set("ign", ign);
    }

    if(uuid != undefined) {
      url.searchParams.set(uuid);
    }

    if(discordID != undefined) {
      url.searchParams.set("discid", discordID);
    }

    if(time != undefined) {
      url.searchParams.set("time", time);
    }

    let acc;
    try {
      acc = await (await fetch(url)).json();
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e.stack);
      Logger.err(acc);
      return {};
    }

    return acc;
  }

  static async info () {
    const url = new URL("info", cfg.dbUrl);

    let info;
    try {
      info = await (await fetch(url)).json();
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e.stack);
      Logger.err(info);
      return {};
    }

    return info;
  }

  static destroy () {
    cacheClear.unref();
  }

}

module.exports = Database;