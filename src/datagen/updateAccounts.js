const logger = require("hyarcade-logger");
const utils = require("../utils");
const cfg = require("../Config").fromJSON();
let force = utils.fileExists("force") || cfg.alwaysForce;
const Runtime = require("../Runtime");
const fs = require("fs-extra");
const Account = require("hyarcade-requests/types/Account");

/**
 * Update the player data for all players in the list
 *
 * @param {Account[]} accounts
 * @returns {Account[]}
 */
module.exports = async function updateAccounts(accounts) {
    let accs = accounts.sort(utils.winsSorter);
    await fs.writeFile("starttime", (`${Date.now()}`));

    let oldAccs = await utils.readDB("accounts");

    let i,
        j,
        temparray,
        chunk = 120;
    for(i = 0, j = accs.length; i < j; i += chunk) {
        temparray = accs.slice(i, i + chunk);
        await updateAccountsInArr(temparray, oldAccs);
    }

    if(utils.fileExists("data/accounts.json.part")) {
        let addedAccounts = await utils.readJSON("accounts.json.part");
        await fs.rm("data/accounts.json.part");
        accs = accs.concat(addedAccounts);
    }

    if(utils.fileExists("data/accounts.json.full")) {
        let fullList = await utils.readJSON("accounts.json.full");
        await fs.rm("data/accounts.json.full");
        for(let i = 0; i < accs.length; i++) {
            let acc = accs[i];
            let newAcc = fullList.find((a) => a.uuid == acc.uuid);
            if(newAcc != undefined && newAcc.updateTime > acc.updateTime) {
                logger.info(`Setting ${newAcc.name}'s data from outside source!`);
                acc.setData(newAcc);
            }
        }
    }

    let runtime = Runtime.fromJSON();
    runtime.needRoleupdate = true;
    await runtime.save();

    if(force && utils.fileExists("force")) {
        await fs.rm("force");
    }

    await accs.sort(utils.winsSorter);
    return accs;
};

/**
 * @param {Account[]} accounts
 * @param {Account[]} oldAccs
 * @returns {Promise}
 */
async function updateAccountsInArr(accounts, oldAccs) {
    return await Promise.all(
        accounts.map(async (account) => {
            let oldAcc = oldAccs.find((a) => a.uuid == account.uuid);
            if(oldAcc != undefined && !force) {

                // Make sure they have a relavent amount of arcade games wins
                let isArcadePlayer = oldAcc.arcadeWins >= 1500;

                // Make sure their arcade wins are not inflated due to football
                let fbAboveInflationLimit = oldAcc.footballWins >= 15000;
                let fbBelowInflationLimit = oldAcc.footballWins <= 250;

                let notFbInflated = fbBelowInflationLimit || fbAboveInflationLimit;

                // Make sure their arcade wins are not inflated due to mini walls
                let mwAboveInflationLimit = oldAcc.miniWallsWins >= 12000;
                let mwBelowInflationLimit = oldAcc.miniWallsWins <= 250;

                let notMwInflated = mwBelowInflationLimit || mwAboveInflationLimit;

                // Linked players should update more often since they will check their own stats
                let isLinked = oldAcc.discord ? true : false;

                // Ignore people who have not played within the last 3.5 days
                let hasPlayedRecently = Date.now() - oldAcc.lastLogout < 302400000;

                let hasImportantStats = isArcadePlayer && notFbInflated && notMwInflated;

                if((isLinked || hasImportantStats) && hasPlayedRecently) {
                    logger.out(`Updating ${oldAcc.name}'s data`);
                    await account.updateData();
                } else {
                    logger.info(`Ignoring ${oldAcc.name} for this refresh`);
                    account.setData(oldAcc);
                }
            } else {
                logger.out(`Updating ${account.name}'s data`);
                await account.updateData();
            }
        })
    );
}
