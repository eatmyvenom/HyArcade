const Webhook = require("../webhook");
const config = require("../../config.json");

class AccountEvent {
    name = "";
    type = "";
    oldAmnt = 0;
    newAmnt = 0;
    modifier = "";
    constructor(name, type, old, neww, modifier) {
        this.name = name;
        this.type = type;
        this.oldAmnt = old;
        this.newAmnt = neww;
        this.modifier = modifier;
    }

    toString() {
        if (this.type == "PG") {
            return `${this.name} just hit ${this.newAmnt} party game wins!`;
        } else if (this.type == "HITW") {
            return `${this.name} just got a ${this.newAmnt} ${this.modifier}!`;
        } else if (this.type == "HYSAYS") {
            return `${this.name} just hit ${this.newAmnt} Hypixel says wins!`;
        }
    }

    async toDiscord() {
        if (this.type == "PG") {
            await Webhook.sendBasic(this.toString(), config.events.PG.webhook);
        } else if ((this.type = "HITW")) {
            await Webhook.sendBasic(this.toString(), config.events.PGT.webhook);
        } else if ((this.type = "HYSAYS")) {
            await Webhook.sendBasic(this.toString(), config.events.PGT.webhook);
        }
    }
}

module.exports = AccountEvent;
