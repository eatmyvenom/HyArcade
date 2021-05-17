const cfg = require("../Config").fromJSON();
const { WebhookClient } = require("discord.js");
const Runtime = require("../Runtime");
const utils = require("../utils");
const { logger } = require("../utils");
const BotUtils = require("./BotUtils");
const registerSlashCommands = require("./registerSlashCommands");
const roleHandler = require("./roleHandler");
const fs = require('fs/promises')

module.exports = class BotEvents {
    static async rateLimit(rlInfo) {
        let timeout = rlInfo.timeout;
        let str = `Bot rate limited\nTime : ${timeout}\nCause : ${rlInfo.method.toUpperCase()} - ${
            rlInfo.path
        }\n`;
        logger.err(str);
        await BotUtils.errHook.send(str);
    }

    static async messageDelete(msg) {
        if (msg.content.charAt(0) == cfg.commandCharacter) {
            let str = `Command Deleted: ${msg.guild.name}#${msg.channel.name} ${msg.author.tag} - ${msg.content} `;
            logger.out(str);
            await BotUtils.errHook.send(str);
        }
    }

    static async ready(mode) {
        BotUtils.isBotInstance = true;
        logger.out("Fetching logging channels");
        let errchannel = await BotUtils.client.channels.fetch(
            cfg.discord.errChannel
        );
        let logchannel = await BotUtils.client.channels.fetch(
            cfg.discord.logChannel
        );
        let errhooks = await errchannel.fetchWebhooks();
        let loghooks = await logchannel.fetchWebhooks();
        let errHook = await errhooks.first();
        let logHook = await loghooks.first();
        BotUtils.errHook = errHook;
        BotUtils.logHook = logHook;
        BotUtils.msgCopyHook = new WebhookClient(
            cfg.loggingHooks.copyHook.id,
            cfg.loggingHooks.copyHook.token
        );
        logger.out("Initializing file cache");
        BotUtils.fileCache.acclist = await utils.readJSON("accounts.json");
        BotUtils.fileCache.disclist = await utils.readJSON("disclist.json");
        BotUtils.fileCache.status = await utils.readJSON("status.json");
        BotUtils.fileCache.updatetime = await fs.readFile("timeupdate");
        BotUtils.fileCache.dayacclist = await utils.readJSON("accounts.day.json");
        BotUtils.fileCache.weeklyacclist = await utils.readJSON("accounts.weekly.json");
        BotUtils.fileCache.monthlyacclist = await utils.readJSON("accounts.monthly.json");
        logger.out("Selecting mode");
        if (mode == "role") {
            await roleHandler(BotUtils.client);
            await BotUtils.client.destroy();
        } else if (mode == "slash") {
            await registerSlashCommands(BotUtils.client);
            logger.out(
                `Logged in as ${BotUtils.client.user.tag} - Slash command handler`
            );
            logHook.send(
                `Logged in as ${BotUtils.client.user.tag} - Slash command handler`
            );
        } else {
            logger.out(`Logged in as ${BotUtils.client.user.tag}!`);
            logHook.send(`Logged in as ${BotUtils.client.user.tag}!`);
            BotUtils.client.user.setPresence(cfg.discord.presence);
        }
    }

    static async tick() {
        let runtime = Runtime.fromJSON();
        if (runtime.needRoleupdate) {
            await roleHandler(BotUtils.client);
            await BotUtils.logHook.send("Roles Updated");
            runtime.needRoleupdate = false;
            await runtime.save();
        }
    }

    static async heartBeat() {
        logger.out("Heart beat - I'm alive!");
    }

    static async dataRefresh() {
        BotUtils.fileCache.dayacclist = await utils.readJSON("accounts.day.json");
        BotUtils.fileCache.weeklyacclist = await utils.readJSON("accounts.weekly.json");
        BotUtils.fileCache.monthlyacclist = await utils.readJSON("accounts.monthly.json");
        BotUtils.fileCache.acclist = await utils.readJSON("accounts.json");
        BotUtils.fileCache.disclist = await utils.readJSON("disclist.json");
        BotUtils.fileCache.status = await utils.readJSON("status.json");
        BotUtils.fileCache.updatetime = await fs.readFile("timeupdate");
    }
};
