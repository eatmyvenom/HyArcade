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
        let run = Runtime.fromJSON();
        let error = false;
        let accs, dayacclist, weeklyacclist, monthlyacclist, acclist, disclist, status, updatetime, hackers, ezmsgs;
        try {
            dayacclist = await utils.readJSON("accounts.day.json");
            weeklyacclist = await utils.readJSON("accounts.weekly.json");
            monthlyacclist = await utils.readJSON("accounts.monthly.json");
            accs = await utils.readJSON("accounts.json");
            acclist = await utils.readJSON("acclist.json");
            disclist = await utils.readJSON("disclist.json");
            status = await utils.readJSON("status.json");
            updatetime = await fs.readFile("timeupdate");
            hackers = await fs.readFile("data/hackerlist");
            hackers = hackers.toString().split("\n");
            ezmsgs = await fs.readFile("data/ez");
            ezmsgs = ezmsgs.toString().split("\n");
        } catch (e) {
            error = true;
            run.dbERROR = true;
            await run.save();
            Logger.err("Database broken please fix me");
            await BotUtils.errHook.send("Database broken please fix me");
        }

        this.accounts = accs;
        this.dailyAccounts = dayacclist;
        this.weeklyAccounts = weeklyacclist;
        this.monthlyAccounts = monthlyacclist;
        this.acclist = acclist;
        this.disclist = disclist;
        this.status = status;
        this.updatetime = updatetime;
        this.hackerlist = hackers;
        this.ezmsgs = ezmsgs;

        Logger.debug("Files updated");

        if (!error && run.dbERROR) {
            run.dbERROR = false;
            await run.save();
            Logger.log("Database restored");
        }
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