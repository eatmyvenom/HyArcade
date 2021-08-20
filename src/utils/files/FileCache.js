const utils = require("../../utils");
const Logger = require("hyarcade-logger");
const fs = require("fs-extra");
const BSONreader = require("./BSONreader");
const AccountArray = require("../../request/types/AccountArray");

class FileCache {

    _interval;
    accounts = [];
    dailyAccounts = [];
    weeklyAccounts = [];
    monthlyAccounts = [];
    acclist = {};
    players = [];
    guilds = [];
    guildsDay = [];
    disclist = {};
    status = {};
    updatetime = 0;
    hackerlist = [];
    blacklist = [];
    ezmsgs = [];
    dirty = false;
    path = "data/";

    constructor (path = "data/") {
      this.path = path;
      FileCache.refresh(this);
      this._interval = setInterval(FileCache.refresh, 25000, this);
    }

    destroy () {
      this._interval.unref();
      for(const prop in this) {
        this[prop] = undefined;
      }
    }

    save () {
      this.dirty = true;
    }

    async runSave () {
      Logger.info("Saving file changes...");
      await utils.writeJSON("accounts.json", this.accounts);
      await utils.writeJSON("acclist.json", this.acclist);
      await utils.writeJSON("disclist.json", this.disclist);
      await utils.writeJSON("status.json", this.status);
      if(this.blacklist.join("\n").trim() != "") {
        await fs.writeFile(`${this.path}blacklist`, this.blacklist.join("\n").trim());
      }
      if(this.hackerlist.join("\n").trim() != "") {
        await fs.writeFile(`${this.path}hackerlist`, this.hackerlist.join("\n").trim());
      }
      await fs.writeFile(`${this.path}ez`, this.ezmsgs.join("\n"));
      Logger.debug("Files saved...");
      this.dirty = false;
    }

    /**
     * 
     * @param {FileCache} fileCache 
     */
    static async refresh (fileCache) {
      if(fileCache.dirty) {
        await fileCache.runSave();
      }

      Logger.debug("Refreshing file cache...");

      const accounts = await BSONreader("accounts.json");
      fileCache.accounts = new AccountArray(accounts);

      const dailyAccounts = await BSONreader("accounts.day.json");
      fileCache.dailyAccounts = new AccountArray(dailyAccounts);

      const weeklyAccounts = await utils.readJSON("accounts.weekly.json");
      fileCache.weeklyAccounts = new AccountArray(weeklyAccounts);

      const monthlyAccounts = await utils.readJSON("accounts.monthly.json");
      fileCache.monthlyAccounts = new AccountArray(monthlyAccounts);

      fileCache.acclist = await BSONreader("acclist.json");
      fileCache.disclist = await utils.readJSON("disclist.json");
      fileCache.status = await utils.readJSON("status.json");
      fileCache.updatetime = await fs.readFile("timeupdate");
      fileCache.players = await utils.readJSON("players.json");
      fileCache.guilds = await utils.readJSON("guild.json");
      const blacklist = await fs.readFile(`${fileCache.path}blacklist`);
      const hackerlist = await fs.readFile(`${fileCache.path}hackerlist`);
      fileCache.ezmsgs = (await fs.readFile(`${fileCache.path}ez`)).toString().split("\n");

      if(blacklist.toString().trim() != "") {
        fileCache.blacklist = blacklist.toString().trim()
          .split("\n");
      }
      if(hackerlist.toString().trim() != "") {
        fileCache.hackerlist = hackerlist.toString().trim()
          .split("\n");
      }

      Logger.debug("File cache updated");
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
