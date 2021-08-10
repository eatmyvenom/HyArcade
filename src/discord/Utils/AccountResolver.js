const Account = require("../../classes/account");
const mojangRequest = require("../../request/mojangRequest");
const logger = require("hyarcade-logger");
const {
    Message
} = require("discord.js");

/**
 * @param {*} str
 * @returns {string}
 */
function stringify (str) {
    return `${str}`;
}

/**
 *
 * @param {string} string
 * @param {Message} rawMessage
 * @param {boolean} canbeSelf
 * @param {Account[]} acclist
 * @param {object} disclist
 * @returns {Account}
 */
module.exports = async function resolveAccount (string, rawMessage, canbeSelf, acclist, disclist) {
    logger.info(`Attempting to resolve ${string} from ${rawMessage.content}`);
    const queryString = stringify(queryString).toLowerCase();
    let acc;
    if(queryString.length == 18) {
        acc = acclist.find((a) => a.discord == queryString);
    }

    if(acc == undefined && queryString.length != 0 && queryString.length > 16) {
        acc = acclist.find((a) => a.uuid?.toLowerCase() == queryString);
    } else if(acc == undefined && queryString.length != 0 && queryString != "undefined" && queryString.length <= 16) {
        acc = acclist.find((a) => a.name?.toLowerCase() == queryString);
    }

    if(queryString.length > 1 && acc == undefined) {
        const discusers = await rawMessage.guild.members.fetch({
            query: queryString,
            limit: 1,
        });
        if(discusers.size > 0) {
            const usr = discusers.first();
            const {id} = usr;
            const uuid = disclist[id];
            if(uuid != undefined) {
                acc = acclist.find((a) => a.uuid == uuid);
            }
        }
    }

    if(acc == undefined) {
        if(rawMessage.mentions.users.size > 0) {
            const discid = `${rawMessage.mentions.users.first()}`;
            const uuid = disclist[discid];
            if(uuid != undefined) {
                acc = acclist.find((a) => a.uuid?.toLowerCase() == uuid.toLowerCase());
            }
        }
    }

    if(acc == undefined && canbeSelf) {
        const discid = rawMessage.author.id;
        const uuid = disclist[discid];
        logger.debug(`Resolved as ${uuid} from discord account list`);
        if(uuid != undefined) {
            acc = acclist.find((a) => a.uuid?.toLowerCase() == uuid.toLowerCase());
        }
    }

    if(acc) {
        logger.info(`resolved as ${acc.name}`);
    } else {
        logger.out("Unable to resolve account in database, getting by ign from hypixel.");

        const plr = queryString;
        let uuid;
        if(plr.length > 17) {
            uuid = plr;
        } else {
            uuid = await mojangRequest.getUUID(plr);
        }

        acc = new Account("", 0, `${uuid}`);
        await acc.updateData();
    }
    return acc;
};
