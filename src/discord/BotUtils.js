const cfg = require("hyarcade-config").fromJSON();
const AdvancedEmbeds = require("./Utils/Embeds/AdvancedEmbeds");
const AccountResolver = require("./Utils/AccountResolver");
const fetch = require("node-fetch");
const Logger = require("hyarcade-logger");
const {
    MessageEmbed
} = require("discord.js");

module.exports = class BotUtils {
    static isBotInstance = false;
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
        } catch (e) {
            Logger.err("Can't connect to database");
            Logger.err(e);
            return {};
        }
        Logger.debug("Data fetched!");
        return fileData;
    }

    static async writeToDB(path, json) {
        let data = JSON.stringify(json);
        let url = new URL("db", cfg.dbUrl);
        url.searchParams.set("path", path);
        Logger.debug(`Writing to ${path} in database`);

        try {
            await fetch(url.toString(), {
                method: "post",
                body: data,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": cfg.dbPass
                }
            });
        } catch (e) {
            Logger.err("Can't connect to database");
            Logger.err(e);
            return {};
        }
    }

    static getWebhookObj(embed) {
        let embeds;
        if(embed == undefined) {
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
