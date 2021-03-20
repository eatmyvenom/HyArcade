const AccountEvent = require("./classes/Event");
const { logger } = require("./utils");

class EventDetector {
    OldAccounts = {};
    NewAccounts = {};
    Events = [];

    constructor(OldAccounts, NewAccounts) {
        this.OldAccounts = OldAccounts;
        this.NewAccounts = NewAccounts;
    }

    runDetection() {
        for (let account of this.OldAccounts) {
            let oldAcc = account;
            let newAcc = this.NewAccounts.find((a) => a.uuid == oldAcc.uuid);

            if (oldAcc == undefined || newAcc == undefined) {
                return;
            }
            this.detectWins(
                oldAcc.wins,
                newAcc.wins,
                newAcc.name,
                "PG",
                "",
                newAcc.uuid
            );
            this.detectWins(
                oldAcc.hypixelSaysWins,
                newAcc.hypixelSaysWins,
                newAcc.name,
                "HYSAYS",
                "",
                newAcc.uuid
            );
            this.detectWins(
                oldAcc.farmhuntWins,
                newAcc.farmhuntWins,
                newAcc.name,
                "FH",
                "",
                newAcc.uuid
            );
            this.detectWins(
                oldAcc.hitwWins,
                newAcc.hitwWins,
                newAcc.name,
                "HITW",
                "",
                newAcc.uuid
            );

            if (newAcc.hitwQual > oldAcc.hitwQual) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "HITWPB",
                        oldAcc.hitwQual,
                        newAcc.hitwQual,
                        "qualifiers",
                        newAcc.uuid
                    )
                );
            }

            if (newAcc.hitwFinal > oldAcc.hitwFinal) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "HITWPB",
                        oldAcc.hitwFinal,
                        newAcc.hitwFinal,
                        "finals",
                        newAcc.uuid
                    )
                );
            }
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
