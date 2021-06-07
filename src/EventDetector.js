const AccountEvent = require("./classes/Event");
const utils = require("./utils");
const { logger } = require("./utils");
const cfg = require("./Config").fromJSON();

class EventDetector {
    OldAccounts = {};
    NewAccounts = {};
    Events = [];

    constructor(OldAccounts, NewAccounts) {
        this.OldAccounts = OldAccounts;
        this.NewAccounts = NewAccounts;
    }

    scanAccount(account) {
        let oldAcc = account;
        let newAcc = this.NewAccounts.find((a) => a.uuid == oldAcc.uuid);

        if (oldAcc == undefined || newAcc == undefined) {
            return;
        }

        let oldIndex = this.OldAccounts.indexOf(oldAcc);
        let newIndex = this.NewAccounts.indexOf(newAcc);

        this.detectWinsAuto(oldAcc, newAcc, "wins", "PG");
        this.detectWinsAuto(oldAcc, newAcc, "hypixelSaysWins", "HYSAYS");
        this.detectWinsAuto(oldAcc, newAcc, "farmhuntWins", "FH");
        this.detectWinsAuto(oldAcc, newAcc, "hitwWins", "HITW");
        this.detectWinsAuto(oldAcc, newAcc, "throwOutWins", "TO");
        this.detectWinsAuto(oldAcc, newAcc, "miniWallsWins", "MW");
        this.detectWinsAuto(oldAcc, newAcc, "footballWins", "FB");
        this.detectWinsAuto(oldAcc, newAcc, "zombiesWins", "Z");
        this.detectWinsAuto(oldAcc, newAcc, "blockingDeadWins", "BD");
        this.detectWinsAuto(oldAcc, newAcc, "dragonWarsWins", "DW");
        this.detectWinsAuto(oldAcc, newAcc, "bountyHuntersWins", "BH");

        this.detectDiff(oldAcc, newAcc, "hitwQual", "HITWPB", "qualifiers");
        this.detectDiff(oldAcc, newAcc, "hitwFinal", "HITWPB", "finals");

        if (newIndex <= 24 && newIndex < oldIndex && oldAcc.wins != newAcc.wins) {
            this.Events.push(new AccountEvent(newAcc.name, "LBPOS", oldIndex, newIndex, this.OldAccounts[newIndex].name, newAcc.uuid));
        }

        if(oldAcc.name != newAcc.name) {
            this.Events.push(new AccountEvent(newAcc.name, "NAME", oldAcc.name, newAcc.name, "", newAcc.uuid));
        }

        if(oldAcc.discord != newAcc.discord && newAcc.discord != undefined && newAcc.discord != "" && newAcc.discord != 0) {
            this.Events.push(new AccountEvent(newAcc.name, "LINK", oldAcc.discord, newAcc.discord, "", newAcc.uuid));
        }

        if(Date.now() - oldAcc.lastLogout > 2629743000 && newAcc.lastLogout != oldAcc.lastLogout && newAcc.lastLogout != "" && newAcc.lastLogout != 0 && newAcc.lastLogout != undefined) {
            this.Events.push(new AccountEvent(newAcc.name, "LOGIN", oldAcc.lastLogout, newAcc.lastLogout, "", newAcc.uuid));
        }

        if(oldAcc.rank != newAcc.rank && newAcc.rank != "" && newAcc.rank != undefined ) {
            this.Events.push(new AccountEvent(newAcc.name, "RANK", oldAcc.rank, newAcc.rank, "", newAcc.uuid));
        }

        if(oldAcc.ranksGifted != newAcc.ranksGifted && newAcc.ranksGifted != 0 && newAcc.ranksGifted != "" && newAcc.ranksGifted != undefined) {
            this.Events.push(new AccountEvent(newAcc.name, "SIMP", oldAcc.ranksGifted, newAcc.ranksGifted, "", newAcc.uuid));
        }

        if(oldAcc.hasOptifineCape != newAcc.hasOptifineCape && newAcc.hasOptifineCape == false) {
            this.Events.push(new AccountEvent(newAcc.name, "OF", oldAcc.hasOptifineCape, newAcc.hasOptifineCape, "", newAcc.uuid));
        }

        if(Math.floor(oldAcc.level) < Math.floor(newAcc.level) && newAcc.level != undefined && newAcc.level != 0 && newAcc.level != 1) {
            this.Events.push(new AccountEvent(newAcc.name, "LVL", oldAcc.level, newAcc.level, "", newAcc.uuid));
        }

        if(oldAcc.plusColor != newAcc.plusColor && newAcc.plusColor != undefined && newAcc.plusColor != "") {
            this.Events.push(new AccountEvent(newAcc.name, "PLUS", oldAcc.plusColor, newAcc.plusColor, "", newAcc.uuid));
        }
    }

    runDetection() {
        for (let account of this.OldAccounts) {
            this.scanAccount(account);
        }
    }

    detectDiff(oldAcc, newAcc, prop, type, modifier) {
        if (newAcc[prop] > oldAcc[prop]) {
            this.Events.push(new AccountEvent(newAcc.name, type, oldAcc[prop], newAcc[prop], modifier, newAcc.uuid));
        }
    }

    detectWinsAuto(oldAcc, newAcc, prop, type) {
        if (newAcc[prop] % cfg.events[type].winMod == 0 && newAcc[prop] > oldAcc[prop]) {
            this.Events.push(new AccountEvent(newAcc.name, type, oldAcc[prop], newAcc[prop], "", newAcc.uuid));
        }
    }

    detectWins(oldWc, newWc, name, type, modifier, uuid) {
        if (newWc % 500 == 0 && newWc > oldWc) {
            this.Events.push(new AccountEvent(name, type, oldWc, newWc, modifier, uuid));
        }
    }

    detectSpecific(oldWc, newWc, amnt, name, type, modifier, uuid) {
        if (newWc == amnt && newWc > oldWc) {
            this.Events.push(new AccountEvent(name, type, oldWc, newWc, modifier, uuid));
        }
    }

    async sendEvents() {
        for (let evt of this.Events) {
            await evt.toDiscord();
        }
    }

    async saveEvents() {
        let oldEvents = await utils.readJSON("events.json");
        for(let event of this.Events) {
            oldEvents.unshift([event, event.toString()]);
        }

        oldEvents = oldEvents.slice(0,Math.min(oldEvents.length, 100));
        await utils.writeJSON("events.json", oldEvents);
    }

    logEvents() {
        for (let evt of this.Events) {
            logger.out(evt.toString());
        }
    }
}

module.exports = EventDetector;
