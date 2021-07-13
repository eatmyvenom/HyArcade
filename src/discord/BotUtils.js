const { MessageEmbed, Client } = require("discord.js");
const cfg = require("../Config").fromJSON();
const AdvancedEmbeds = require("./AdvancedEmbeds");
const AccountResolver = require("./Utils/AccountResolver");
const fetch = require("node-fetch");
const Logger = require("../utils/Logger");
const { logger } = require("../utils");

module.exports = class BotUtils {
    static isBotInstance = false;

    /**
     * @type {Client}
     */
    static client;
    static botMode;
    static tus = [];

    static get trustedUsers() {
        return BotUtils.tus;
    }

    static async resolveAccount(string, rawMessage, canbeSelf = true) {
        return await AccountResolver(
            string,
            rawMessage,
            canbeSelf,
            await this.getFromDB("accounts"),
            await this.getFromDB("disclist")
        );
    }

    static async getFromDB(file) {
        let fileData;
        let url = new URL("db", cfg.dbUrl);
        let path = `${file}`;
        url.searchParams.set("path", path);
        Logger.debug(`Fetching ${url.searchParams.toString()} from database`);
    
        try {
            fileData = await (await fetch(url)).json();
        } catch(e) {
            logger.err("Can't connect to database");
            logger.err(e);
            return {};
        }
        return fileData;
    }

    static async writeToDB(path, json) {
        let data = JSON.stringify(json);
        let url = new URL("db", cfg.dbUrl);
        url.searchParams.set("path", path);
        Logger.debug(`Writing to ${path} in database`);

        try {
            await fetch(url.toString(), {
                method: 'post',
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': cfg.dbPass
                }
            });
        } catch(e) {
            logger.err("Can't connect to database");
            logger.err(e);
            return {};
        }
    }

    static getWebhookObj(embed) {
        let embeds;
        if (embed == undefined) {
            embeds = [];
        } else {
            embeds = [embed];
        }
        return {
            username: BotUtils.client.user.username,
            avatarURL: BotUtils.client.user.avatarURL(),
            embeds: embeds,
        };
    }

    static async getStats(acc, game) {
        /**
         * @type {MessageEmbed}
         */
        let embed = await AdvancedEmbeds.getStats(
            acc,
            game,
            BotUtils.client.user.avatarURL(),
            BotUtils.botMode
        );
        return embed;
    }
};
