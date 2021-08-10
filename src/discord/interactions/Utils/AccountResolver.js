const fetch = require("node-fetch");
const logger = require("hyarcade-logger");
const mojangRequest = require("../../../request/mojangRequest");
const BotUtils = require("../../BotUtils");
const {
    CommandInteraction
} = require("discord.js");
const Account = require("hyarcade-requests/types/Account");
const cfg = require("hyarcade-config").fromJSON();

/**
 * @param {string} string
 * @param {CommandInteraction} interaction
 * @returns {Promise<Account>}
 */
async function getFromHypixel (string, interaction) {
    if(!interaction.deferred) {
        await interaction.defer();
    }
    logger.info("Unable to resolve, getting by ign from hypixel.");

    let plr = string;
    let uuid;
    if(plr?.length > 17) {
        uuid = plr;
    } else {
        uuid = await mojangRequest.getUUID(plr);
    }

    let acc = new Account("", 0, `${uuid}`);
    await acc.updateData();
    return acc;
}

/**
 *
 * @param {CommandInteraction} interaction
 * @param {string} namearg
 * @returns {Account}
 */
module.exports = async function resolveAccount (interaction, namearg = "player") {
    let str = interaction.options.getString(namearg, false);
    if(BotUtils.botMode == "mini") {
        return await getFromHypixel(str, interaction);
    }

    let url = new URL("account", cfg.dbUrl);
    let urlArgs = url.searchParams;
    if(str?.length == 32) {
        urlArgs.set("uuid", str.toLowerCase());
    } else if(str?.length == 36) {
        urlArgs.set("uuid", str.toLowerCase().replace(/-/g, ""));
    } else if(str != null) {
        urlArgs.set("ign", str.toLowerCase());
    } else {
        urlArgs.set("discid", interaction.user.id);
    }

    logger.debug(`Fetching ${url.searchParams.toString()} from database`);
    let accdata = await fetch(url.toString());
    if(accdata.status == 200) {
        accdata = await accdata.json();
        if(str == undefined && accdata.name_lower == "INVALID-NAME") {
            return undefined;
        }
        return accdata;
    } else {
        return await getFromHypixel(str, interaction);
    }
};
