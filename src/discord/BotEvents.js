const cfg = require("../Config").fromJSON();
const { WebhookClient } = require("discord.js");
const { logger } = require("../utils");
const BotUtils = require("./BotUtils");
const registerSlashCommands = require("./registerSlashCommands");
const roleHandler = require("./roleHandler");

module.exports = class BotEvents {
    static async rateLimit(rlInfo) {
        let timeout = rlInfo.timeout;
        let str = `Bot rate limited\nTime : ${timeout}\nCause : ${rlInfo.method.toUpperCase()} - ${rlInfo.path}\n`
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
        if(mode == "role") {
            await roleHandler(BotUtils.client);
            await BotUtils.client.destroy();
        } else if (mode == "slash") {
            await registerSlashCommands(BotUtils.client);
        } else {
            logger.out(`Logged in as ${BotUtils.client.user.tag}!`);
            logHook.send(`Logged in as ${BotUtils.client.user.tag}!`);
            BotUtils.client.user.setPresence(cfg.discord.presence);
            BotUtils.msgCopyHook = new WebhookClient(cfg.loggingHooks.copyHook.id, cfg.loggingHooks.copyHook.token);
        }
    }
};
