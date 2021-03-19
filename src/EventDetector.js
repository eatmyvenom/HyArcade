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

            if (newAcc.wins >= 500 && oldAcc.wins < 500) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "PG",
                        oldAcc.wins,
                        newAcc.wins,
                        ""
                    )
                );
            } else if (newAcc.wins >= 669 && oldAcc.wins < 669) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "PG",
                        oldAcc.wins,
                        newAcc.wins,
                        ""
                    )
                );
            } else if (newAcc.wins >= 750 && oldAcc.wins < 750) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "PG",
                        oldAcc.wins,
                        newAcc.wins,
                        ""
                    )
                );
            } else if (newAcc.wins >= 1000 && oldAcc.wins < 1000) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "PG",
                        oldAcc.wins,
                        newAcc.wins,
                        ""
                    )
                );
            } else if (newAcc.wins >= 1500 && oldAcc.wins < 1500) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "PG",
                        oldAcc.wins,
                        newAcc.wins,
                        ""
                    )
                );
            } else if (newAcc.wins >= 2000 && oldAcc.wins < 2000) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "PG",
                        oldAcc.wins,
                        newAcc.wins,
                        ""
                    )
                );
            } else if (newAcc.wins >= 2500 && oldAcc.wins < 2500) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "PG",
                        oldAcc.wins,
                        newAcc.wins,
                        ""
                    )
                );
            } else if (newAcc.wins >= 3000 && oldAcc.wins < 3000) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "PG",
                        oldAcc.wins,
                        newAcc.wins,
                        ""
                    )
                );
            } else if (newAcc.wins >= 3500 && oldAcc.wins < 3500) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "PG",
                        oldAcc.wins,
                        newAcc.wins,
                        ""
                    )
                );
            } else if (newAcc.wins >= 4000 && oldAcc.wins < 4000) {
                this.Events.push(
                    new AccountEvent(
                        newAcc.name,
                        "PG",
                        oldAcc.wins,
                        newAcc.wins,
                        ""
                    )
                );
            }

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
