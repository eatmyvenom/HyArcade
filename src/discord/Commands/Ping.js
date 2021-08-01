const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../classes/Command");
const BotUtils = require("../BotUtils");
const CommandResponse = require("../Utils/CommandResponse");
const TimeFormatter = require("../Utils/Formatting/TimeFormatter");

let statusName = [
    "READY",
    "CONNECTING",
    "RECONNECTING",
    "IDLE",
    "NEARLY",
    "DISCONNECTED",
    "WAITING_FOR_GUILDS",
    "IDENTIFYING",
    "RESUMING"
];

module.exports = new Command("ping", ["*"], async () => {
    let embed = new MessageEmbed()
        .setAuthor(BotUtils.client.user.username + " status", BotUtils.client.user.avatarURL(), "https://hyarcade.xyz/")
        .addField(
            "Status",
            `📡 Ping - ${BotUtils.client.ws.ping}ms\n` +
            `📟 Status - ${statusName[BotUtils.client.ws.status]}\n` +
            `⏲️ Start time - ${TimeFormatter(Date.now() - BotUtils.client.uptime)}\n`,
            true
        )
        .addField(
            "Info",
            `📊 Servers - ${BotUtils.client.guilds.cache.size}\n` +
            `📈 Users - ${BotUtils.client.guilds.cache.reduce((a,g)=>a+g.memberCount,0)}\n` +
            `🗒️ Channels - ${BotUtils.client.channels.cache.size}`,
            true
        )
        .setColor(0x8c54fe);
    return new CommandResponse({
        res: "",
        embed: embed
    });
});
