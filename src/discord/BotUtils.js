const listUtils = require("../listUtils");
const utils = require("../utils");
const webhook = require("../webhook");

function stringify(str) {
    return "" + str;
}

module.exports = class BotUtils {
    static async resolveAccount(string, rawMessage) {
        string = stringify(string);
        let acclist = await utils.readJSON("./accounts.json");
        let acc;

        if (string.length > 16) {
            acc = acclist.find(
                (a) => a.uuid.toLowerCase() == string.toLowerCase()
            );
        } else if (string.length <= 16) {
            acc = acclist.find(
                (a) => a.name.toLowerCase() == string.toLowerCase()
            );
        }

        if (acc == undefined) {
            let discid = rawMessage.author.id;
            acc = acclist.find(
                (a) =>
                    stringify(a.discord).toLowerCase() == discid.toLowerCase()
            );
        }

        return acc;
    }

    static getWebhookObj(embed) {
        let embeds;
        if (embed == undefined) {
            embeds = [];
        } else {
            embeds = [embed];
        }
        return {
            username: "Arcade Bot",
            avatarURL:
                "https://cdn.discordapp.com/avatars/818719828352696320/e3d2cac7292077850196fe232f1e7efe.webp",
            embeds: embeds,
        };
    }

    static async getPGDailyEmbed() {
        let day = await listUtils.listDiff("accounts", "day", 999);
        return webhook.generateEmbed(day);
    }
};
