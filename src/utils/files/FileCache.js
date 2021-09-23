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
        const accounts = await utils.readJSON("accounts.json");
        const dailyAccounts = await utils.readJSON("accounts.day.json");
        const weeklyAccounts = await utils.readJSON("accounts.weekly.json");
        const monthlyAccounts = await utils.readJSON("accounts.monthly.json");
        const acclist = await utils.readJSON("acclist.json");
        const disclist = await utils.readJSON("disclist.json");
        const updatetime = await fs.readFile("timeupdate");
        const players = await utils.readJSON("players.json");
        const guilds = await utils.readJSON("guild.json");
        const blacklist = await fs.readFile(`${fileCache.path}blacklist`);
        const hackerlist = await fs.readFile(`${fileCache.path}hackerlist`);
        const ezmsgs = await fs.readFile(`${fileCache.path}ez`);
        
        fileCache.acclist = acclist;
        fileCache.disclist = disclist;
        fileCache.updatetime = updatetime;
        fileCache.players = players;
        fileCache.guilds = guilds;
        fileCache.accounts = new AccountArray(accounts);
        fileCache.dailyAccounts = new AccountArray(dailyAccounts);
        fileCache.weeklyAccounts = new AccountArray(weeklyAccounts);
        fileCache.monthlyAccounts = new AccountArray(monthlyAccounts);
        if(ezmsgs.toString().trim() != "") {
          fileCache.ezmsgs = ezmsgs.toString().trim()
            .split("\n")
            .filter((v) => v != "");
        }
        
        if(blacklist.toString().trim() != "") {
          fileCache.blacklist = blacklist.toString().trim()
            .split("\n")
            .filter((v) => v != "");
        }
        
        if(hackerlist.toString().trim() != "") {
          fileCache.hackerlist = hackerlist.toString().trim()
            .split("\n")
            .filter((v) => v != "");
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
