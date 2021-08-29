const Logger = require("hyarcade-logger");
const fetch = require("node-fetch");
const cfg = require("hyarcade-config").fromJSON();

module.exports = class Database {

  static async addAccount (json) {
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
      Logger.err(e);
      return {};
    }
  }

  static async getLeaderboard (path, category, time, min) {
    const url = new URL("lb", cfg.dbUrl);
    url.searchParams.set("path", path);
    
    if(category != undefined) {
      url.searchParams.set("category", category);
    }

    if(time != undefined) {
      url.searchParams.set("time", time);
    }

    if(min) {
      url.searchParams.set("min", "");
    }

    let lb;

    try {
      lb = await (await fetch(url)).json();
    } catch (e) {
      Logger.err("Can't connect to database");
      Logger.err(e);
      Logger.err(lb);
      return {};
    }

    return lb;
  }

  static async getMWLeaderboard (stat, time) {
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
      Logger.err(e);
      Logger.err(lb);
      return {};
    }

    return lb;
  }

};
