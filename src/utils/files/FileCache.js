const utils = require("../../utils");
const Logger = require("../Logger");
const fs = require('fs-extra');
const Runtime = require("../../Runtime");

module.exports = class FileCache {

    _interval;
    _accounts = {}
    _dailyAccounts = {};
    _weeklyAccounts = {};
    _monthlyAccounts = {};
    _acclist = {};
    _disclist = {};
    _status = {};
    _updatetime = 0;
    _hackerlist = [];
    _ezmsgs = [];
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

        this._accounts = accs;
        this._dailyAccounts = dayacclist;
        this._weeklyAccounts = weeklyacclist;
        this._monthlyAccounts = monthlyacclist;
        this._acclist = acclist;
        this._disclist = disclist;
        this._status = status;
        this._updatetime = updatetime;
        this._hackerlist = hackers;
        this._ezmsgs = ezmsgs;

        Logger.debug("Files updated");

        if (!error && run.dbERROR) {
            run.dbERROR = false;
            await run.save();
            Logger.log("Database restored");
        }
    }

    _fullCopy(object) {
        return JSON.parse(JSON.stringify(object));
    }

    get accounts() {
        return this._fullCopy(this._accounts);
    }

    get dailyAccounts() {
        return this._fullCopy(this._dailyAccounts);
    }

    get dayaccounts () {
        return this.dailyAccounts;
    }

    get weeklyAccounts() {
        return this._fullCopy(this._weeklyAccounts);
    }

    get weeklyaccounts() {
        return this.weeklyAccounts;
    }

    get monthlyAccounts() {
        return this._fullCopy(this._monthlyAccounts);
    }

    get monthlyaccounts() {
        return this.monthlyAccounts;
    }

    get acclist() {
        return this._fullCopy(this._acclist);
    }

    get disclist() {
        return this._fullCopy(this._disclist);
    }

    get status() {
        return this._fullCopy(this._status);
    }

    get updatetime() {
        return this._fullCopy(this._updatetime);
    }

    get hackerlist() {
        return this._fullCopy(this._hackerlist);
    }

    get ezmsgs() {
        return this._fullCopy(this._ezmsgs);
    }

    set accounts(o) {
        this._accounts = o;
    }
}