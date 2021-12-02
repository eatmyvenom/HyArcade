const utils = require("../../utils");
const Logger = require("hyarcade-logger");
const fs = require("fs-extra");
const AccountArray = require("hyarcade-requests/types/AccountArray");
const Account = require("hyarcade-requests/types/Account");
const Accounts = require("./Accounts");

/**
 * 
 * @param {Account[]} accounts 
 * @returns {*}
 */
function indexAccs (accounts) {
  const obj = {};

  for(const acc of accounts) {
    obj[acc.uuid] = acc;
  }

  return obj;
}

class FileCache {

    _interval;

    indexedAccounts = {};
    indexedDaily = {};
    indexedWeekly = {};
    indexedMonthly = {};

    AccountsProcessor;
    DailyProcessor;
    MonthlyProcessor;

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
      this._interval = setInterval(FileCache.refresh, 600000, this);
      this.AccountsProcessor = new Accounts(`${path}/accounts`);
      this.DailyProcessor = new Accounts(`${path}/accounts.day`);
      this.MonthlyProcessor = new Accounts(`${path}/accounts.monthly`);
      // this.WeeklyProcessor = new Accounts(`${path}/accounts.weekly`);

      FileCache.refresh(this);
    }

    get accounts () {
      return AccountArray(Object.values(this.indexedAccounts));
    }

    set accounts (accs) {
      this.indexedAccounts = indexAccs(accs);
    }

    get dailyAccounts () {
      return AccountArray(Object.values(this.indexedDaily));
    }

    get weeklyAccounts () {
      return AccountArray(Object.values(this.indexedWeekly));
    }

    get monthlyAccounts () {
      return AccountArray(Object.values(this.indexedMonthly));
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

        Logger.debug("Saving acclist");
        await utils.writeJSON("acclist.json", this.acclist);

        Logger.debug("Saving disclist");
        await utils.writeJSON("disclist.json", this.disclist);

        Logger.debug("Saving blacklist");
        if(this.blacklist.join("\n").trim() != "") {
          await fs.writeFile(`${this.path}blacklist`, this.blacklist.join("\n").trim());
        }

        Logger.debug("Saving hackerlist");
        if(this.hackerlist.join("\n").trim() != "") {
          await fs.writeFile(`${this.path}hackerlist`, this.hackerlist.join("\n").trim());
        }

        Logger.debug("Saving ezmsgs");
        if(this.ezmsgs.join("\n").trim() != "") {
          await fs.writeFile(`${this.path}ez`, this.ezmsgs.join("\n"));
        }
        this.modTime = Date.now() - 1000;

        Logger.debug("Saving seperate accounts");
        await this.AccountsProcessor.writeAccounts(this.accounts);

        Logger.debug("Saving accounts");
        await utils.writeJSON("accounts.json", `[${this.accounts.map((acc) => JSON.stringify(acc)).join(",")}]`);

        Logger.debug("Files saved...");
        this.dirty = false;
      } catch (e) {
        Logger.err("ERROR SAVING FILES!");
        Logger.err(e.stack);
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

        Logger.debug("Reading daily accounts");
        const dailyAccounts = await fileCache.DailyProcessor.readAccounts();
        fileCache.indexedDaily = indexAccs(dailyAccounts);

        Logger.debug("Reading weekly accounts");
        const weeklyAccounts = await utils.readJSON("accounts.weekly.json");
        fileCache.indexedWeekly = indexAccs(weeklyAccounts);

        Logger.debug("Reading monthly accounts");
        const monthlyAccounts = await fileCache.MonthlyProcessor.readAccounts();
        fileCache.indexedMonthly = indexAccs(monthlyAccounts);

        Logger.debug("Reading guild data");
        const guild = await utils.readJSON("guild.json");
        fileCache.guilds = guild;

        Logger.debug("Reading retroactive data");
        const retroMonth = await utils.readJSON("accounts.retro.monthly.json");
        fileCache.retro.monthlyaccounts = retroMonth;

        const retroWeekly = await utils.readJSON("accounts.retro.weekly.json");
        fileCache.retro.weeklyaccounts = retroWeekly;
      } catch (e) {
        Logger.err("Error refreshing static files!");
        Logger.err(e.stack);
      }

      if(fileCache.dirty) {
        return await fileCache.runSave();
      }

      Logger.info("Refreshing file cache...");

      try {
        const accStat = await fs.stat(`${fileCache.path}accounts.json`);
        if(Math.max(accStat.ctimeMs, accStat.mtimeMs) > fileCache.modTime) {
          Logger.debug("Reading accounts data");
          const accounts = await fileCache.AccountsProcessor.readAccounts();
          fileCache.indexedAccounts = indexAccs(accounts);
        } else {
          Logger.debug("accounts has not been modified, ignoring!");
        }

        Logger.debug("Reading accounts list");
        const acclist = await utils.readJSON("acclist.json");
        fileCache.acclist = acclist;

        const disclistStat = await fs.stat(`${fileCache.path}disclist.json`);
        if(Math.max(disclistStat.ctimeMs, disclistStat.mtimeMs) > fileCache.modTime) {
          Logger.debug("Reading discord links");
          const disclist = await utils.readJSON("disclist.json");
          fileCache.disclist = disclist;
        } else {
          Logger.debug("disclist has not been modified, ignoring!");
        }

        const timeStat = await fs.stat("timeupdate");
        if(Math.max(timeStat.ctimeMs, timeStat.mtimeMs) > fileCache.modTime) {
          Logger.debug("Reading update time");
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

    get indexedday () {
      return this.indexedDaily;
    }

    get indexedweekly () {
      return this.indexedWeekly;
    }

    get indexedmonthly () {
      return this.indexedMonthly;
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
