const utils = require("../../utils");
const Logger = require("../Logger");
const fs = require('fs-extra');
const Runtime = require("../../Runtime");
const BSONreader = require("./BSONreader");

module.exports = class FileCache {

    _interval;
    accounts = {}
    dailyAccounts = {};
    weeklyAccounts = {};
    monthlyAccounts = {};
    acclist = {};
    disclist = {};
    status = {};
    updatetime = 0;
    hackerlist = [];
    ezmsgs = [];
    path = "data/";

    constructor(path) {
        this.path = path;
        FileCache.refresh(this);
        this._interval = setInterval(FileCache.refresh, 25000, this);
    }

    destroy() {
        this._interval.unref();
        for(let prop in this) {
            this[prop] = undefined;
        }
    }

    async save() {
        Logger.debug("Saving file changes...")
        await utils.writeJSON("accounts.json", this._accounts);
        await utils.writeJSON("accounts.weekly.json", this._weeklyAccounts);
        await utils.writeJSON("accounts.day.json", this._dailyAccounts);
        await utils.writeJSON("accounts.monthly.json", this._monthlyAccounts);
        await utils.writeJSON("acclist.json", this._acclist);
        await utils.writeJSON("disclist.json", this._disclist);
        await utils.writeJSON("status.json", this._status);
        await fs.writeFile("data/hackerlist", this._hackerlist.join("\n"));
        await fs.writeFile("data/ez", this._ezmsgs.join("\n"));
        Logger.debug("Files saved...");
    }

    static async refresh(fileCache) {
        Logger.debug("Refreshing file cache...");

        fileCache.accounts = await BSONreader("accounts.json");
        fileCache.dailyAccounts = await BSONreader("accounts.day.json");
        fileCache.weeklyAccounts = await utils.readJSON("accounts.weekly.json");
        fileCache.monthlyAccounts = await utils.readJSON("accounts.monthly.json");
        fileCache.acclist = await BSONreader("acclist.json");
        fileCache.disclist = await utils.readJSON("disclist.json");
        fileCache.status = await utils.readJSON("status.json");
        fileCache.updatetime = await fs.readFile("timeupdate");
        fileCache.hackerlist = (await fs.readFile("data/hackerlist")).toString().split("\n");
        fileCache.ezmsgs = (await fs.readFile("data/ez")).toString().split("\n");

        Logger.debug("File cache updated");
    }

    get dayaccounts () {
        return this.dailyAccounts;
    }

    get weeklyaccounts() {
        return this.weeklyAccounts;
    }

    get monthlyaccounts() {
        return this.monthlyAccounts;
    }

}