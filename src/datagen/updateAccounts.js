const logger = require("../utils/Logger");
const utils = require("../utils");
const cfg = require("../Config").fromJSON();
let force = utils.fileExists("force") || cfg.alwaysForce;
const Runtime = require("../Runtime");

/**
 * Update the player data for all players in the list
 * @param {Account[]} accounts
 * @return {Account[]}
 */
module.exports = async function updateAccounts(accounts) {
    accounts.sort(utils.winsSorter);

    let oldAccs = await utils.readJSON("accounts.json");

    let i,
        j,
        temparray,
        chunk = 120;
    for (i = 0, j = accounts.length; i < j; i += chunk) {
        temparray = accounts.slice(i, i + chunk);
        await updateAccountsInArr(temparray, oldAccs);
    }

    if (utils.fileExists("data/accounts.json.part")) {
        let addedAccounts = await utils.readJSON("accounts.json.part");
        await fs.rm("data/accounts.json.part");
        accounts = accounts.concat(addedAccounts);
    }

    if (utils.fileExists("data/accounts.json.full")) {
        let fullList = await utils.readJSON("accounts.json.full");
        await fs.rm("data/accounts.json.full");
        for (let i = 0; i < accounts.length; i++) {
            let acc = accounts[i];
            let newAcc = fullList.find((a) => a.uuid == acc.uuid);
            if (newAcc != undefined && newAcc.updateTime > acc.updateTime) {
                logger.info(`Setting ${newAcc.name}'s data from outside source!`);
                acc.setData(newAcc);
            }
        }
    }

    let runtime = Runtime.fromJSON();
    runtime.needRoleupdate = true;
    await runtime.save();

    if (force && utils.fileExists("force")) {
        await fs.rm("force");
    }

    await accounts.sort(utils.winsSorter);
    await accounts.filter((a) => a.name != "" && a.uuidPosix != undefined);
    return accounts;
}

async function updateAccountsInArr(accounts, oldAccs) {
    return await Promise.all(
        accounts.map(async (account) => {
            let oldAcc = oldAccs.find((a) => a.uuid == account.uuid);
            if (oldAcc != undefined && !force) {
                let aboveArcadeLimit = oldAcc.arcadeWins >= 900;
                let fbAboveCringeLimit = oldAcc.footballWins >= 15000;
                let fbBelowCringeLimit = oldAcc.footballWins <= 150;
                let fbOutsideCringeLimit = fbBelowCringeLimit || fbAboveCringeLimit;
                let mwAboveCringeLimit = oldAcc.miniWallsWins >= 150;
                let mwBelowCringeLimit = oldAcc.miniWallsWins <= 12000;
                let mwOutsideCringeLimit = mwBelowCringeLimit || mwAboveCringeLimit;
                let isLinked = oldAcc.discord ? true : false;
                let hasPlayedRecently = Date.now() - oldAcc.lastLogout < 604800000;

                let hasImportantStats = aboveArcadeLimit && fbOutsideCringeLimit && mwOutsideCringeLimit

                if ((isLinked || hasImportantStats) && hasPlayedRecently) {
                    logger.out(`Updating ${oldAcc.name}'s data`);
                    await account.updateData();
                } else {
                    logger.info(`Ignoring ${oldAcc.name} for this refresh`);
                    account.setData(oldAcc);
                }
            } else {
                await account.updateData();
            }
        })
    );
}