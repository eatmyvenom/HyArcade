const Webhook = require("../events/webhook");
const config = require("../Config").fromJSON();
const {
    MessageEmbed
} = require("discord.js");

class AccountEvent {
    name = "";
    type = "";
    oldAmnt = 0;
    newAmnt = 0;
    modifier = "";
    uuid = "";
    time = 0;

    constructor (name, type, old, neww, modifier, uuid) {
        this.name = name;
        this.type = type;
        this.oldAmnt = old;
        this.newAmnt = neww;
        this.modifier = modifier;
        this.uuid = uuid;
        this.time = Date.now();
    }

    toString () {
        if(this.type == "HITWPB") {
            return `${this.name} just got a ${this.modifier} personal best of ${this.newAmnt}! Was ${this.oldAmnt}.`;
        } else if(this.type == "LBPOS") {
            return `${this.name} just passed ${this.modifier} and got to rank ${
                this.newAmnt + 1
            } on the party games leaderboard!`;
        } else if(this.type == "NAME") {
            return `${this.oldAmnt} has renamed themselves to ${this.name}`;
        } else if(this.type == "LINK") {
            return `${this.name} has been linked.`;
        } else if(this.type == "LOGIN") {
            return `${this.name} Logged in for the first time in a while!`;
        } else if(this.type == "RANK") {
            return `${this.name}'s rank changed to ${this.newAmnt.replace(/_PLUS/g, "+")} from ${(
                `${this.oldAmnt}`
            ).replace(/_PLUS/g, "+")}`;
        } else if(this.type == "SIMP") {
            return `${this.name} gifted rank(s)`;
        } else if(this.type == "OF") {
            return `${this.name} just purchased an optifine cape!`;
        } else if(this.type == "LVL") {
            return `${this.name} just leveled up to ${this.newAmnt}!`;
        } else if(this.type == "PLUS") {
            return `${this.name} just set their plus color to ${this.newAmnt}!`;
        } else {
            return `${this.name} just hit ${this.newAmnt} ${config.events[this.type].name} wins!`;
        }
    }

    async toDiscord () {
        if(this.type == "PG") {
            await Webhook.sendBasic(this.toString(), config.events[this.type].webhook);
        } else if(this.type == "HITWPB") {
            let embed = await this.getHitWEmbed();
            await Webhook.sendBasicEmbed("", [embed], config.events.HITW.webhook);
        } else if(this.type == "HITW") {
            await Webhook.sendBasic(this.toString(), config.events.HITW.webhook);
        } else {
            if(config.events[this.type]) {
                await Webhook.sendBasic(this.toString(), config.events[this.type].webhook);
            }
        }
    }

    async getHitWEmbed () {
        let avatar =
            `https://crafatar.com/renders/body/${this.uuid}.png?size=512&default=MHF_Steve&scale=10&overlay`;

        let thumb = `https://crafatar.com/avatars/${this.uuid}.png?size=512?default=MHF_Steve&scale=10&overlay`;

        let embed = new MessageEmbed()
            .setAuthor(this.name, thumb)
            .setThumbnail(avatar)
            .setFooter(`UUID: ${this.uuid}`)
            .setColor(0x0066cc)
            .setTitle(`${this.name} just got a new **${this.modifier}** Personal Best!`)
            .addField("Old PB", `**${this.oldAmnt}**`, true)
            .addField("New PB", `**${this.newAmnt}**`, true)
            .addField("Increase", `**${this.newAmnt - this.oldAmnt}**`, true);

        return embed;
    }
}

module.exports = AccountEvent;
