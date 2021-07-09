const utils = require("../../utils");
const Logger = require("../Logger");
const fs = require('fs-extra');
const Runtime = require("../../Runtime");

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
        this.refresh();
        this._interval = setInterval(this.refresh, 25000);
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

    async refresh() {
        Logger.debug("Refreshing file cache...");

        this.accounts = await utils.readJSON("accounts.json");
        this.dailyAccounts = await utils.readJSON("accounts.day.json");
        this.weeklyAccounts = await utils.readJSON("accounts.weekly.json");
        this.monthlyAccounts = await utils.readJSON("accounts.monthly.json");
        this.acclist = await utils.readJSON("acclist.json");
        this.disclist = await utils.readJSON("disclist.json");
        this.status = await utils.readJSON("status.json");
        this.updatetime = await fs.readFile("timeupdate");
        this.hackerlist = (await fs.readFile("data/hackerlist")).toString().split("\n");
        this.ezmsgs = (await fs.readFile("data/ez")).toString().split("\n");

        Logger.debug("Files updated");
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