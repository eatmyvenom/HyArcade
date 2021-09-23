const utils = require("../../utils");
const Logger = require("hyarcade-logger");
const fs = require("fs-extra");
const AccountArray = require("../../request/types/AccountArray");
const Account = require("hyarcade-requests/types/Account");

class FileCache {

    _interval;

    /** @type {Account[]} */
    accounts = [];

    /** @type {Account[]} */
    dailyAccounts = [];

    /** @type {Account[]} */
    weeklyAccounts = [];

    /** @type {Account[]} */
    monthlyAccounts = [];
    acclist = {};
    players = [];
    guilds = [];
    guildsDay = [];
    disclist = {};
    updatetime = 0;
    modTime = 0;
    hackerlist = [];
    blacklist = [];
    ezmsgs = [];
    dirty = false;
    path = "data/";

    constructor (path = "data/") {
      this.path = path;
      FileCache.refresh(this);
      this._interval = setInterval(FileCache.refresh, 600000, this);
    }

    destroy () {
      this._interval.unref();
      for(const prop in this) {
        delete this[prop];
      }
    }

    save () {
      this.dirty = true;
    }

    async runSave () {
      try {
        Logger.info("Saving file changes...");
        await utils.writeJSON("accounts.json", this.accounts);
        await utils.writeJSON("acclist.json", this.acclist);
        await utils.writeJSON("disclist.json", this.disclist);
        if(this.blacklist.join("\n").trim() != "") {
          await fs.writeFile(`${this.path}blacklist`, this.blacklist.join("\n").trim());
        }
        if(this.hackerlist.join("\n").trim() != "") {
          await fs.writeFile(`${this.path}hackerlist`, this.hackerlist.join("\n").trim());
        }
        if(this.ezmsgs.join("\n").trim() != "") {
          await fs.writeFile(`${this.path}ez`, this.ezmsgs.join("\n"));
        }
        Logger.debug("Files saved...");
        this.dirty = false;
        this.modTime = Date.now();
      } catch (e) {
        Logger.err("ERROR SAVING FILES!");
        Logger.err(e);
      }
    }

    /**
     * 
     * @param {FileCache} fileCache 
     * @returns {object}
     */
    static async refresh (fileCache) {
      if(fileCache.dirty) {
        return await fileCache.runSave();
      }

      Logger.debug("Refreshing file cache...");

      try {
        const accStat = await fs.stat(`${fileCache.path}accounts.json`);
        if(Math.max(accStat.ctimeMs, accStat.mtimeMs) > fileCache.modTime) {
          const accounts = await utils.readJSON("accounts.json");
          fileCache.accounts = new AccountArray(accounts);
        }

        const daccStat = await fs.stat(`${fileCache.path}accounts.day.json`);
        if(Math.max(daccStat.ctimeMs, daccStat.mtimeMs) > fileCache.modTime) {
          const dailyAccounts = await utils.readJSON("accounts.day.json");
          fileCache.dailyAccounts = new AccountArray(dailyAccounts);
        }

        const waccStat = await fs.stat(`${fileCache.path}accounts.weekly.json`);
        if(Math.max(waccStat.ctimeMs, waccStat.mtimeMs) > fileCache.modTime) {
          const weeklyAccounts = await utils.readJSON("accounts.weekly.json");
          fileCache.weeklyAccounts = new AccountArray(weeklyAccounts);
        }

        const maccStat = await fs.stat(`${fileCache.path}accounts.monthly.json`);
        if(Math.max(maccStat.ctimeMs, maccStat.mtimeMs) > fileCache.modTime) {
          const monthlyAccounts = await utils.readJSON("accounts.monthly.json");
          fileCache.monthlyAccounts = new AccountArray(monthlyAccounts);
        }

        const acclistStat = await fs.stat(`${fileCache.path}acclist.json`);
        if(Math.max(acclistStat.ctimeMs, acclistStat.mtimeMs) > fileCache.modTime) {
          const acclist = await utils.readJSON("acclist.json");
          fileCache.acclist = acclist;
        }

        const disclistStat = await fs.stat(`${fileCache.path}disclist.json`);
        if(Math.max(disclistStat.ctimeMs, disclistStat.mtimeMs) > fileCache.modTime) {
          const disclist = await utils.readJSON("disclist.json");
          fileCache.disclist = disclist;
        }

        const timeStat = await fs.stat("timeupdate");
        if(Math.max(timeStat.ctimeMs, timeStat.mtimeMs) > fileCache.modTime) {
          const updatetime = await fs.readFile("timeupdate");
          fileCache.updatetime = updatetime;
        }

        const plrStat = await fs.stat(`${fileCache.path}players.json`);
        if(Math.max(plrStat.ctimeMs, plrStat.mtimeMs) > fileCache.modTime) {
          const players = await utils.readJSON("players.json");
          fileCache.players = players;
        }

        const gldStat = await fs.stat(`${fileCache.path}guild.json`);
        if(Math.max(gldStat.ctimeMs, gldStat.mtimeMs) > fileCache.modTime) {
          const guilds = await utils.readJSON("guild.json");
          fileCache.guilds = guilds;
        }

        const blackStat = await fs.stat(`${fileCache.path}blacklist`);
        if(Math.max(blackStat.ctimeMs, blackStat.mtimeMs) > fileCache.modTime) {
          const blacklist = await fs.readFile(`${fileCache.path}blacklist`);
          if(blacklist.toString().trim() != "") {
            fileCache.blacklist = blacklist.toString().trim()
              .split("\n")
              .filter((v) => v != "");
          }
        }

        const hackStat = await fs.stat(`${fileCache.path}hackerlist`);
        if(Math.max(hackStat.ctimeMs, hackStat.mtimeMs) > fileCache.modTime) {
          const hackerlist = await fs.readFile(`${fileCache.path}hackerlist`);
          if(hackerlist.toString().trim() != "") {
            fileCache.hackerlist = hackerlist.toString().trim()
              .split("\n")
              .filter((v) => v != "");
          }
        }

        const ezStat = await fs.stat(`${fileCache.path}ez`);
        if(Math.max(ezStat.ctimeMs, ezStat.mtimeMs) > fileCache.modTime) {
          const ezmsgs = await fs.readFile(`${fileCache.path}ez`);
          if(ezmsgs.toString().trim() != "") {
            fileCache.ezmsgs = ezmsgs.toString().trim()
              .split("\n")
              .filter((v) => v != "");
          }
        }

        Logger.debug("File cache updated");

      } catch (e) {
        Logger.error("ERROR REFRESHING FILES!");
        Logger.error(e.stack);
      }
    }

    get dayaccounts () {
      return this.dailyAccounts;
    }

    get weeklyaccounts () {
      return this.weeklyAccounts;
    }

    get monthlyaccounts () {
      return this.monthlyAccounts;
    }

}

module.exports = FileCache;
