const { MessageEmbed } = require("discord.js");
const utils = require("../../utils");
const BotUtils = require("../BotUtils");

module.exports = class InteractionUtils {
    static async resolveAccount(interaction) {
        let string = "undefinednullnonothingno";
        if (interaction.data.options != undefined) {
            string = interaction.data.options[0].value;
        }
        string = stringify(string);
        let acclist = await utils.readJSON("./accounts.json");
        let acc;
        if (string.length == 18) {
            acc = acclist.find((a) => a.discord == string);
        }

        if (acc == undefined && string.length > 16) {
            acc = acclist.find(
                (a) => a.uuid.toLowerCase() == string.toLowerCase()
            );
        } else if (acc == undefined && string.length <= 16) {
            acc = acclist.find(
                (a) => a.name.toLowerCase() == string.toLowerCase()
            );
        }

        if (acc == undefined) {
            let discid = interaction.member.user.id;
            acc = acclist.find(
                (a) =>
                    stringify(a.discord).toLowerCase() == discid.toLowerCase()
            );
        }

        return acc;
    }

    static async sendEphemeralMsg(interaction) {
        await BotUtils.client.api
            .interactions(interaction.id, interaction.token)
            .callback.post({
                data: {
                    type: 4,
                    data: {
                        content:
                            "Since the the database does not contain the account(s) it will take some time to gather the stats. Please wait!",
                        flags: 1 << 6,
                    },
                },
            });
    }
};

function stringify(str) {
    return "" + str;
}
