const { Message } = require("discord.js");
const Account = require("../../classes/account");
const mojangRequest = require("../../request/mojangRequest");

/**
 * 
 * @param {String} string 
 * @param {Message} rawMessage 
 * @param {Boolean} canbeSelf 
 * @param {Account[]} acclist 
 * @param {Object} disclist 
 * @returns 
 */
module.exports = async function resolveAccount(string, rawMessage, canbeSelf, acclist, disclist) {
    logger.info("Attempting to resolve " + string + " from " + rawMessage.content);
    string = stringify(string).toLowerCase();
    let acc;
    if (string.length == 18) {
        acc = acclist.find((a) => a.discord == string);
    }

    if (acc == undefined && string.length != 0 && string.length > 16) {
        acc = acclist.find((a) => a.uuid?.toLowerCase() == string);
    } else if (acc == undefined && string.length != 0 && string != "undefined" && string.length <= 16) {
        acc = acclist.find((a) => a.name?.toLowerCase() == string);
    }

    if (string.length > 1 && acc == undefined) {
        let discusers = await rawMessage.guild.members.fetch({
            query: string,
            limit: 1,
        });
        if (discusers.size > 0) {
            let usr = discusers.first();
            let id = usr.id;
            let uuid = disclist[id];
            if (uuid != undefined) {
                acc = acclist.find((a) => a.uuid == uuid);
            }
        }
    }

    if (acc == undefined) {
        if (rawMessage.mentions.users.size > 0) {
            let discid = "" + rawMessage.mentions.users.first();
            let uuid = disclist[discid];
            if (uuid != undefined) {
                acc = acclist.find((a) => a.uuid?.toLowerCase() == uuid.toLowerCase());
            }
        }
    }

    if (acc == undefined && canbeSelf) {
        let discid = rawMessage.author.id;
        let uuid = disclist[discid];
        logger.debug(`Resolved as ${uuid} from discord account list`)
        if (uuid != undefined) {
            acc = acclist.find((a) => a.uuid?.toLowerCase() == uuid.toLowerCase());
        }
    }

    if (acc) {
        logger.info("resolved as " + acc.name);
    } else {
        logger.out("Unable to resolve account in database, getting by ign from hypixel.");

        let plr = string;
        let uuid;
        if (plr.length > 17) {
            uuid = plr;
        } else {
            uuid = await mojangRequest.getUUID(plr);
        }

        acc = new Account("", 0, "" + uuid);
        await acc.updateData();
    }
    return acc;
}