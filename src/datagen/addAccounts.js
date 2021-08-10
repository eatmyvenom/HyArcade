const utils = require("../utils");
const logger = utils.logger;
const isValidIGN = require("./utils/ignValidator");
const Account = require("../classes/account");
const {
    getUUID
} = require("../request/mojangRequest");

/**
 * Add a list of accounts to another list
 *
 * @param {string} category
 * @param {string[]} names
 * @returns {null}
 */
module.exports = async function addAccounts (category, names) {
    let res = "";
    let acclist = await utils.readDB("acclist");
    let newAccs = [];
    if(acclist[category] == undefined) {
        logger.err("Please input a valid category!");
        return "Please input a valid category!";
    }
    let nameArr = names;
    for(let name of nameArr) {
        let uuid;
        if(name.length == 32 || name.length == 36) {
            uuid = name.replace(/-/g, "");
        } else {
            if(!isValidIGN(name)) {
                logger.warn(`${name} is not a valid IGN and is being ignored!`);
                res += `${name} is not a valid IGN!\n`;
                continue;
            }
            uuid = await getUUID(name);
        }

        if(uuid == undefined) {
            res += `${name} does not exist!\n`;
            continue;
        }

        if(
            acclist[category].find((acc) => acc.uuid == uuid) ||
            acclist["gamers"].find((acc) => acc.uuid == uuid) ||
            acclist["afkers"].find((acc) => acc.uuid == uuid)
        ) {
            logger.warn(`Refusing to add duplicate! (${name})`);
            res += `Refusing to add duplicate! (${name})\n`;
            continue;
        }

        let acc = new Account("", 0, uuid);
        await acc.updateHypixel();
        let wins = acc.wins;
        name = acc.name;

        if(wins < 50 && category == "gamers") {
            logger.warn("Refusing to add account with under 50 pg wins to gamers!");
        } else {
            newAccs.push(acc);
            logger.out(`${name} with ${acc.arcadeWins} wins added.`);
            res += `${name} with ${acc.arcadeWins} wins added.\n`;
        }
    }
    let oldAccounts = await utils.readDB("accounts");
    let fullNewAccounts = oldAccounts.concat(newAccs);
    acclist = await utils.readDB("acclist");
    for(let acc of newAccs) {
        let lilAcc = {
            name: acc.name,
            wins: acc.wins,
            uuid: acc.uuid
        };
        acclist[category].push(lilAcc);
    }

    acclist.others = acclist.others.filter(a => {
        return a.uuid != undefined;
    });
    fullNewAccounts.filter(a => {
        return a.uuid != undefined;
    });
    newAccs.filter(a => {
        return a.uuid != undefined;
    });

    await utils.writeDB("acclist", acclist);
    await utils.writeDB("accounts", fullNewAccounts);
    return res;
};
