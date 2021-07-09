const { MessageEmbed } = require("discord.js");
const helpText = require("../HelpText");
const BotUtils = require("../BotUtils");
const Account = require("../../classes/account");
const AccountResolver = require("./Utils/AccountResolver");
const { FULL_HELP: help } = require("../Embeds");

module.exports = class InteractionUtils {
    /**
     * Get an account just purely from a uuid without going
     * through the full resolver
     * @static
     * @param {String} uuid
     * @return {Account}
     */
    static async accFromUUID(uuid) {
        let acc;
        if(BotUtils.botMode != "mini") {
            let acclist = await BotUtils.getFromDB("accounts");
            acc = acclist.find((a) => a?.uuid == uuid);
        }

        if (acc == undefined) {
            acc = new Account("", 0, "" + uuid);
            await acc.updateData();
        }

        return acc;
    }

    static async resolveAccount(interaction, namearg = "player") {
        return await AccountResolver(interaction, namearg);
    }

    static helpEmbed() {
        return help;
    }

    static helpTopic(topicName) {
        let e = new MessageEmbed();
        let topic = topicName.slice(6);

        e.setTitle(topic);
        e.setColor(0x0066cc);

        e.setDescription(helpText[topic]);
        return e;
    }
};
