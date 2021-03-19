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

            this.detectWins(oldAcc.wins, newAcc.wins, newAcc.name, "PG", "");
            this.detectWins(
                oldAcc.hypixelSaysWins,
                newAcc.hypixelSaysWins,
                newAcc.name,
                "HYSAYS",
                ""
            );
            this.detectWins(
                oldAcc.farmhuntWins,
                newAcc.farmhuntWins,
                newAcc.name,
                "FH",
                ""
            );

            if (newAcc.hitwQual > oldAcc.hitwQual) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "HITW",
                        oldAcc.hitwQual,
                        newAcc.hitwQual,
                        "qualifiers"
                    )
                );
            }

            if (newAcc.hitwFinal > oldAcc.hitwFinal) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "HITW",
                        oldAcc.hitwFinal,
                        newAcc.hitwFinal,
                        "finals"
                    )
                );
            }
        }
    }

    detectWins(oldWc, newWc, name, type, modifier) {
        if (newWc % 500 == 0 && newWc > oldWc) {
            this.Events.push(
                new AccountEvent(name, type, oldWc, newWc, modifier)
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
