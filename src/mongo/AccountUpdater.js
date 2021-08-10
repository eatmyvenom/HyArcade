const Account = require("../classes/account");
const utils = require("../utils");
const {logger} = utils;
const cfg = require("../Config").fromJSON();
const force = utils.fileExists("force") || cfg.alwaysForce;

module.exports = async function (database) {
    const accs = await database.collection("accounts");
    const allAccs = await accs.find({});
    const rawAccs = await allAccs.toArray();
    const acclist = [];
    for(const acc of rawAccs) {
        const newAcc = new Account(acc.name, acc.wins, acc.uuid);
        newAcc.setData(acc);
        acclist.push(newAcc);
    }

    let i,
        j,
        temparray;

    const chunk = 120;
    for(i = 0, j = acclist.length; i < j; i += chunk) {
        temparray = acclist.slice(i, i + chunk);
        await updateAccountsInArr(temparray, acclist, accs);
    }
};

/**
 * @param {object} accounts
 * @param {object} oldAccs
 * @param {collection} collection
 * @returns {Promise}
 */
async function updateAccountsInArr (accounts, oldAccs, collection) {
    return await Promise.all(
        accounts.map(async (account) => {
            const oldAcc = oldAccs.find((a) => a.uuid == account.uuid);
            if(oldAcc != undefined && !force) {
                const aboveArcadeLimit = oldAcc.arcadeWins >= cfg.arcadeWinLimit;
                const fbAboveCringeLimit = oldAcc.footballWins >= cfg.cringeGameUpperBound;
                const fbBelowCringeLimit = oldAcc.footballWins <= cfg.cringeGameLowerBound;
                const fbOutsideCringeLimit = fbBelowCringeLimit || fbAboveCringeLimit;
                const mwAboveCringeLimit = oldAcc.miniWallsWins >= cfg.cringeGameUpperBound;
                const mwBelowCringeLimit = oldAcc.miniWallsWins <= cfg.cringeGameLowerBound;
                const mwOutsideCringeLimit = mwBelowCringeLimit || mwAboveCringeLimit;
                const isLinked = !!oldAcc.discord;
                const hasPlayedRecently = Date.now() - oldAcc.lastLogout < 2629743000;

                if(
                    isLinked ||
                    (aboveArcadeLimit && fbOutsideCringeLimit && mwOutsideCringeLimit && hasPlayedRecently)
                ) {
                    logger.out(`Updating ${oldAcc.name}'s data`);
                    await account.updateData();
                } else {
                    logger.out(`Ignoring ${oldAcc.name} for this refresh`);
                    account.setData(oldAcc);
                }
            } else {
                await account.updateData();
            }
            const updateObj = {
                $set: account
            };
            await collection.updateOne({
                uuid: account.uuid
            }, updateObj);
        })
    );
}
