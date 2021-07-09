const { CommandInteraction } = require("discord.js");
const Account = require("../../../classes/account");
const fetch = require('node-fetch');
const logger = require("../../../utils/Logger");
const mojangRequest = require("../../../request/mojangRequest");
const BotUtils = require("../../BotUtils");

async function getFromHypixel(string, interaction) {
    await interaction.defer();
    logger.info("Unable to resolve, getting by ign from hypixel.");

    let plr = string;
    let uuid;
    if (plr?.length > 17) {
        uuid = plr;
    } else {
        uuid = await mojangRequest.getUUID(plr);
    }

    let acc = new Account("", 0, "" + uuid);
    await acc.updateData();
    return acc;
}

/**
 *
 * @param {CommandInteraction} interaction
 * @param {String} namearg
 * @param {Account[]} acclist
 * @returns {Account}
 */
module.exports = async function resolveAccount(interaction, namearg = "player") {
    let str = interaction.options?.get(namearg)?.value;
    if(BotUtils.botMode == "mini") {
        return await getFromHypixel(str, interaction);
    }
    let url = new URL("account", "http://localhost:6000")
    let urlArgs = url.searchParams
    if(str?.length == 32) {
        urlArgs.set("uuid", str.toLowerCase());
    } else if(str?.length == 36) {
        urlArgs.set("uuid", str.toLowerCase().replace(/-/g,""));
    } else if(str != undefined) {
        urlArgs.set("ign", str.toLowerCase());
    } else {
        urlArgs.set("discid", interaction.user.id);
    }

    logger.debug(`Fetching ${url.searchParams.toString()} from database`)
    let accdata = await fetch(url.toString());
    if(accdata.status == 200) {
        accdata = await accdata.json();
        return accdata;
    } else {
        return await getFromHypixel(str, interaction);
    }
};
