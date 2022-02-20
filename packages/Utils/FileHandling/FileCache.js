const fs = require("fs-extra");
const Logger = require("hyarcade-logger");
const { Account, AccountArray } = require("hyarcade-structures");
const Accounts = require("./AccountArray");
const { write, read } = require("./Json");
const List = require("./List");
const MergeDatabase = require("../Database/MergeDatabase");

/**
 *
 * @param {Account[]} accounts
 * @returns {*}
 */
function indexAccs(accounts) {
  const obj = {};

  for (const acc of accounts) {
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
  WeeklyProcessor;

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
  ready = false;
  path = "data/";

  constructor(path = "data/") {
    this.path = path;
    this.AccountsProcessor = new Accounts(`${path}/accounts`);
    this.DailyProcessor = new Accounts(`${path}/accounts.day`);
    this.MonthlyProcessor = new Accounts(`${path}/accounts.monthly`);
    this.WeeklyProcessor = new Accounts(`${path}/accounts.weekly`);

    FileCache.refresh(this);
    this._interval = setInterval(FileCache.refresh, 600000, this);
  }

  get accounts() {
    return AccountArray([...Object.values(this.indexedAccounts)], false);
  }

  get dailyAccounts() {
    return AccountArray([...Object.values(this.indexedDaily)], false);
  }

  get weeklyAccounts() {
    return AccountArray([...Object.values(this.indexedWeekly)], false);
  }

  get monthlyAccounts() {
    return AccountArray([...Object.values(this.indexedMonthly)], false);
  }

  destroy() {
    this._interval.unref();
    for (const prop in this) {
      delete this[prop];
    }
  }

  save() {
    if (this.ready) {
      this.dirty = true;
    }
  }

  async runSave() {
    try {
      Logger.info("Saving file changes...");

      Logger.debug("Saving acclist");
      await write("acclist.json", this.acclist);

      Logger.debug("Saving disclist");
      await write("disclist.json", this.disclist);

      Logger.debug("Saving blacklist");
      await List.write(`${this.path}blacklist`, this.blacklist);

      Logger.debug("Saving hackerlist");
      await List.write(`${this.path}hackerlist`, this.hackerlist);

      Logger.debug("Saving ezmsgs");
      await List.write(`${this.path}ez`, this.ezmsgs);

      Logger.debug("Saving seperate accounts");
      await this.AccountsProcessor.writeAccounts(this.accounts);

      this.modTime = Date.now();
      Logger.debug("Files saved...");
      this.dirty = false;
    } catch (error) {
      Logger.err("ERROR SAVING FILES!");
      Logger.err(error.stack);
    }
  }

  /**
   *
   * @param {FileCache} fileCache
   * @returns {object}
   */
  static async refresh(fileCache) {
    try {
      Logger.info("Refreshing static files");

      Logger.debug("Reading daily accounts");
      const dailyAccounts = await fileCache.DailyProcessor.readAccounts();
      fileCache.indexedDaily = indexAccs(dailyAccounts);

      Logger.debug("Reading weekly accounts");
      const weeklyAccounts = await fileCache.WeeklyProcessor.readAccounts();
      fileCache.indexedWeekly = indexAccs(weeklyAccounts);

      Logger.debug("Reading monthly accounts");
      const monthlyAccounts = await fileCache.MonthlyProcessor.readAccounts();
      fileCache.indexedMonthly = indexAccs(monthlyAccounts);

      Logger.debug("Reading guild data");
      const guild = await read("guild.json");
      fileCache.guilds = guild;

      Logger.debug("Reading retroactive data");
      const retroMonth = await read("accounts.retro.monthly.json");
      fileCache.retro.monthlyaccounts = retroMonth;

      const retroWeekly = await read("accounts.retro.weekly.json");
      fileCache.retro.weeklyaccounts = retroWeekly;
    } catch (error) {
      Logger.err("Error refreshing static files!");
      Logger.err(error.stack);
    }

    if (fileCache.dirty) {
      return await fileCache.runSave();
    }

    Logger.info("Refreshing file cache...");

    try {
      const disclistStat = await fs.stat(`${fileCache.path}disclist.json`);
      if (Math.max(disclistStat.ctimeMs, disclistStat.mtimeMs) > fileCache.modTime) {
        Logger.debug("Reading discord links");
        const disclist = await read("disclist.json");
        fileCache.disclist = disclist;
      } else {
        Logger.debug("disclist has not been modified, ignoring!");
      }

      const timeStat = await fs.stat("timeupdate");
      if (Math.max(timeStat.ctimeMs, timeStat.mtimeMs) > fileCache.modTime) {
        Logger.debug("Reading update time");
        const updatetime = await fs.readFile("timeupdate");
        fileCache.updatetime = updatetime;
      } else {
        Logger.debug("updatetime has not been modified, ignoring!");
      }

      const plrStat = await fs.stat(`${fileCache.path}players.json`);
      if (Math.max(plrStat.ctimeMs, plrStat.mtimeMs) > fileCache.modTime) {
        const players = await read("players.json");
        fileCache.players = players;
      } else {
        Logger.debug("players has not been modified, ignoring!");
      }

      const blackStat = await fs.stat(`${fileCache.path}blacklist`);
      if (Math.max(blackStat.ctimeMs, blackStat.mtimeMs) > fileCache.modTime) {
        fileCache.blacklist = await List.read(`${fileCache.path}blacklist`);
      } else {
        Logger.debug("blacklist has not been modified, ignoring!");
      }

      const hackStat = await fs.stat(`${fileCache.path}hackerlist`);
      if (Math.max(hackStat.ctimeMs, hackStat.mtimeMs) > fileCache.modTime) {
        fileCache.hackerlist = await List.read(`${fileCache.path}hackerlist`);
      } else {
        Logger.debug("hackerlist has not been modified, ignoring!");
      }

      const banStat = await fs.stat(`${fileCache.path}banlist`);
      if (Math.max(banStat.ctimeMs, banStat.mtimeMs) > fileCache.modTime) {
        fileCache.banlist = await List.read(`${fileCache.path}banlist`);
      } else {
        Logger.debug("banlist has not been modified, ignoring!");
      }

      const ezStat = await fs.stat(`${fileCache.path}ez`);
      if (Math.max(ezStat.ctimeMs, ezStat.mtimeMs) > fileCache.modTime) {
        fileCache.ezmsgs = await List.read(`${fileCache.path}ez`);
      } else {
        Logger.debug("ezmsgs has not been modified, ignoring!");
      }

      Logger.debug("Reading seperate accounts");
      const accounts = await fileCache.AccountsProcessor.readAccounts();
      fileCache.indexedAccounts = await MergeDatabase(accounts, [], fileCache);

      fileCache.acclist = Object.keys(fileCache.indexedAccounts);

      Logger.debug("File cache updated");
    } catch (error) {
      Logger.error("ERROR REFRESHING FILES!");
      Logger.error(error.stack);
    }

    fileCache.ready = true;
  }

  get indexedday() {
    return this.indexedDaily;
  }

  get indexedweekly() {
    return this.indexedWeekly;
  }

  get indexedmonthly() {
    return this.indexedMonthly;
  }

  get dayaccounts() {
    return this.dailyAccounts;
  }

  get weeklyaccounts() {
    return this.weeklyAccounts;
  }

  get monthlyaccounts() {
    return this.monthlyAccounts;
  }
}

module.exports = FileCache;
