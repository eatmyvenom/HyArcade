const { MessageEmbed } = require("discord.js");
const helpText = require("../HelpText");
const BotUtils = require("../BotUtils");
const Account = require("../../classes/account");
const AccountResolver = require("./Utils/AccountResolver");
const { help } = require("../Embeds");

module.exports = class InteractionUtils {

    /**
     * Get an account just purely from a uuid without going 
     * through the full resolver
     * @static
     * @param {String} uuid
     * @return {Account}
     */
    static async accFromUUID(uuid) {
        let acclist = await BotUtils.fileCache.acclist;
        let acc = acclist.find((a) => a?.uuid == uuid);

        if (acc == undefined) {
            acc = new Account("", 0, "" + uuid);
            await acc.updateData();
        }

        return acc;
    }

    static async resolveAccount(interaction, namearg = "player") {
        return await AccountResolver(interaction, namearg, BotUtils.fileCache.acclist)
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
