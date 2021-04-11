const cfg = require("../Config").fromJSON();
const { logger } = require("../utils");
const BotUtils = require("./BotUtils");

module.exports = class BotEvents {
    static async rateLimit(rlInfo) {
        let timeout = rlInfo.timeout;
        logger.err("Discord bot rate limited for " + timeout);
        await BotUtils.errHook.send("Discord bot rate limited for " + timeout);
    }

    static async messageDelete(msg) {
        if (msg.content.charAt(0) == cfg.commandCharacter) {
            let str = `Command Deleted: ${msg.guild.name}#${msg.channel.name} ${msg.author.tag} - ${msg.content} `;
            logger.out(str);
            await BotUtils.errHook.send(str);
        }
    }

    static async ready() {
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
        logger.out(`Logged in as ${BotUtils.client.user.tag}!`);
        logHook.send(`Logged in as ${BotUtils.client.user.tag}!`);
        BotUtils.client.user.setPresence(cfg.discord.presence);
    }
};
