const utils = require("../../utils");
const Logger = require("hyarcade-logger");
const fs = require("fs-extra");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const Account = require("hyarcade-requests/types/Account");
const Accounts = require("./Accounts");

class FileCache {

    _interval;
    _accounts;

    /** @type {Account[]} */
    accounts = [];

    /** @type {Account[]} */
    dailyAccounts = [];

    /** @type {Account[]} */
    weeklyAccounts = [];

    /** @type {Account[]} */
    monthlyAccounts = [];
    acclist = {};
    retro = {};
    players = [];
    guilds = [];
    guildsDay = [];
    disclist = {};
    updatetime = 0;
    modTime = 0;
    hackerlist = [];
    blacklist = [];
    banlist = [];
    ezmsgs = [];
    dirty = false;
    path = "data/";

    constructor (path = "data/") {
      this.path = path;
      FileCache.refresh(this);
      this._interval = setInterval(FileCache.refresh, 600000, this);
      this._accounts = new Accounts(`${path}/accounts`);
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
        this.modTime = Date.now() - 1000;

        await this._accounts.writeAccounts(this.accounts);

        Logger.debug("Files saved...");
        this.dirty = false;
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

      try {
        Logger.info("Refreshing static files");

        const dailyAccounts = await utils.readJSON("accounts.day.json");
        fileCache.dailyAccounts = new AccountArray(dailyAccounts);

        const weeklyAccounts = await utils.readJSON("accounts.weekly.json");
        fileCache.weeklyAccounts = new AccountArray(weeklyAccounts);
  
        const monthlyAccounts = await utils.readJSON("accounts.monthly.json");
        fileCache.monthlyAccounts = new AccountArray(monthlyAccounts);

        const guild = await utils.readJSON("guild.json");
        fileCache.guilds = guild;

        const retroMonth = await utils.readJSON("accounts.retro.monthly.json");
        fileCache.retro.monthlyaccounts = retroMonth;

        const retroWeekly = await utils.readJSON("accounts.retro.weekly.json");
        fileCache.retro.weeklyaccounts = retroWeekly;
      } catch (e) {
        Logger.err("Error refreshing static files!");
      }

      if(fileCache.dirty) {
        return await fileCache.runSave();
      }

      Logger.debug("Refreshing file cache...");

      try {
        const accStat = await fs.stat(`${fileCache.path}accounts.json`);
        if(Math.max(accStat.ctimeMs, accStat.mtimeMs) > fileCache.modTime) {
          const accounts = await fileCache._accounts.readAccounts();
          fileCache.accounts = new AccountArray(accounts);
        } else {
          Logger.debug("accounts has not been modified, ignoring!");
        }

        const acclist = await utils.readJSON("acclist.json");
        fileCache.acclist = acclist;

        const disclistStat = await fs.stat(`${fileCache.path}disclist.json`);
        if(Math.max(disclistStat.ctimeMs, disclistStat.mtimeMs) > fileCache.modTime) {
          const disclist = await utils.readJSON("disclist.json");
          fileCache.disclist = disclist;
        } else {
          Logger.debug("disclist has not been modified, ignoring!");
        }

        const timeStat = await fs.stat("timeupdate");
        if(Math.max(timeStat.ctimeMs, timeStat.mtimeMs) > fileCache.modTime) {
          const updatetime = await fs.readFile("timeupdate");
          fileCache.updatetime = updatetime;
        } else {
          Logger.debug("updatetime has not been modified, ignoring!");
        }

        const plrStat = await fs.stat(`${fileCache.path}players.json`);
        if(Math.max(plrStat.ctimeMs, plrStat.mtimeMs) > fileCache.modTime) {
          const players = await utils.readJSON("players.json");
          fileCache.players = players;
        } else {
          Logger.debug("players has not been modified, ignoring!");
        }

        const blackStat = await fs.stat(`${fileCache.path}blacklist`);
        if(Math.max(blackStat.ctimeMs, blackStat.mtimeMs) > fileCache.modTime) {
          const blacklist = await fs.readFile(`${fileCache.path}blacklist`);
          if(blacklist.toString().trim() != "") {
            fileCache.blacklist = blacklist.toString().trim()
              .split("\n")
              .filter((v) => v != "");
          }
        } else {
          Logger.debug("blacklist has not been modified, ignoring!");
        }

        const hackStat = await fs.stat(`${fileCache.path}hackerlist`);
        if(Math.max(hackStat.ctimeMs, hackStat.mtimeMs) > fileCache.modTime) {
          const hackerlist = await fs.readFile(`${fileCache.path}hackerlist`);
          if(hackerlist.toString().trim() != "") {
            fileCache.hackerlist = hackerlist.toString().trim()
              .split("\n")
              .filter((v) => v != "");
          }
        } else {
          Logger.debug("hackerlist has not been modified, ignoring!");
        }

        const banStat = await fs.stat(`${fileCache.path}banlist`);
        if(Math.max(banStat.ctimeMs, banStat.mtimeMs) > fileCache.modTime) {
          const banlist = await fs.readFile(`${fileCache.path}banlist`);
          if(banlist.toString().trim() != "") {
            fileCache.banlist = banlist.toString().trim()
              .split("\n")
              .filter((v) => v != "");
          }
        } else {
          Logger.debug("banlist has not been modified, ignoring!");
        }

        const ezStat = await fs.stat(`${fileCache.path}ez`);
        if(Math.max(ezStat.ctimeMs, ezStat.mtimeMs) > fileCache.modTime) {
          const ezmsgs = await fs.readFile(`${fileCache.path}ez`);
          if(ezmsgs.toString().trim() != "") {
            fileCache.ezmsgs = ezmsgs.toString().trim()
              .split("\n")
              .filter((v) => v != "");
          }
        } else {
          Logger.debug("ezmsgs has not been modified, ignoring!");
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
