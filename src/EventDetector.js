const AccountEvent = require("./classes/Event");
const { logger } = require("./utils");
const cfg = require('./Config').fromJSON();

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
        this.detectWinsAuto(oldAcc, newAcc, "arcadeWins", "ARC");
        this.detectWinsAuto(oldAcc, newAcc, "anyWins", "WINS");

        this.detectDiff(oldAcc, newAcc, "hitwQual", "HITWPB", "qualifiers");
        this.detectDiff(oldAcc, newAcc, "hitwFinal", "HITWPB", "finals");

        if (
            newIndex <= 35 &&
            newIndex < oldIndex &&
            oldAcc.wins != newAcc.wins
        ) {
            this.Events.push(
                new AccountEvent(
                    newAcc.name,
                    "LBPOS",
                    oldIndex,
                    newIndex,
                    "party games",
                    newAcc.uuid
                )
            );
        }
    }

    runDetection() {
        for (let account of this.OldAccounts) {
            this.scanAccount(account);
        }
    }

    detectDiff(oldAcc, newAcc, prop, type, modifier) {
        if (newAcc[prop] > oldAcc[prop]) {
            this.Events.push(
                new AccountEvent(
                    newAcc.name,
                    type,
                    oldAcc[prop],
                    newAcc[prop],
                    modifier,
                    newAcc.uuid
                )
            );
        }
    }

    detectWinsAuto(oldAcc, newAcc, prop, type) {
        if (newAcc[prop] % cfg.events[type].winMod == 0 && newAcc[prop] > oldAcc[prop]) {
            this.Events.push(
                new AccountEvent(
                    newAcc.name,
                    type,
                    oldAcc[prop],
                    newAcc[prop],
                    "",
                    newAcc.uuid
                )
            );
        }
    }

    detectWins(oldWc, newWc, name, type, modifier, uuid) {
        if (newWc % 500 == 0 && newWc > oldWc) {
            this.Events.push(
                new AccountEvent(name, type, oldWc, newWc, modifier, uuid)
            );
        }
    }

    async sendEvents() {
        for (let evt of this.Events) {
            await evt.toDiscord();
        }
    }

    logEvents() {
        for (let evt of this.Events) {
            logger.out(evt.toString());
        }
    }
}

module.exports = EventDetector;
