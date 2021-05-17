const { MessageEmbed } = require("discord.js");
const utils = require("../../utils");
const BotUtils = require("../BotUtils");

module.exports = class InteractionUtils {
    static async resolveAccount(interaction, namearg = 0) {
        let string = "undefinednullnonothingno";
        if (
            interaction.options != undefined &&
            interaction.options[namearg] != undefined
        ) {
            string = interaction.options[namearg].value;
        }
        string = stringify(string).toLowerCase();
        let acclist = await BotUtils.fileCache.acclist;
        let acc;
        if (string.length == 18) {
            acc = acclist.find((a) => a.discord == string);
        }

        if (acc == undefined && string.length > 16) {
            acc = acclist.find((a) => a.uuid == string);
        } else if (acc == undefined && string.length <= 16) {
            acc = acclist.find((a) => a.name.toLowerCase() == string);
        }

        if (acc == undefined) {
            let discid = interaction.member.user.id;
            acc = acclist.find((a) => stringify(a.discord) == discid);
        }

        return acc;
    }
};

function stringify(str) {
    return "" + str;
}
