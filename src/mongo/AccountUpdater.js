const Account = require("../classes/account");
const utils = require("../utils");
const logger = utils.logger;
const cfg = require("../Config").fromJSON();
let force = utils.fileExists("force") || cfg.alwaysForce;

module.exports = async function (database) {
    let accs = await database.collection("accounts");
    let allAccs = await accs.find({});
    let rawAccs = await allAccs.toArray();
    let acclist = [];
    for (let acc of rawAccs) {
        let newAcc = new Account(acc.name, acc.wins, acc.uuid);
        newAcc.setData(acc);
        acclist.push(newAcc);
    }

    let i,
        j,
        temparray,
        chunk = 120;
    for (i = 0, j = acclist.length; i < j; i += chunk) {
        temparray = acclist.slice(i, i + chunk);
        await updateAccountsInArr(temparray, acclist, accs);
    }
};

async function updateAccountsInArr(accounts, oldAccs, collection) {
    return await Promise.all(
        accounts.map(async (account) => {
            let oldAcc = oldAccs.find((a) => a.uuid == account.uuid);
            if (oldAcc != undefined && !force) {
                let aboveArcadeLimit = oldAcc.arcadeWins >= cfg.arcadeWinLimit;
                let fbAboveCringeLimit = oldAcc.footballWins >= cfg.cringeGameUpperBound;
                let fbBelowCringeLimit = oldAcc.footballWins <= cfg.cringeGameLowerBound;
                let fbOutsideCringeLimit = fbBelowCringeLimit || fbAboveCringeLimit;
                let mwAboveCringeLimit = oldAcc.miniWallsWins >= cfg.cringeGameUpperBound;
                let mwBelowCringeLimit = oldAcc.miniWallsWins <= cfg.cringeGameLowerBound;
                let mwOutsideCringeLimit = mwBelowCringeLimit || mwAboveCringeLimit;
                let isLinked = oldAcc.discord ? true : false;
                let hasPlayedRecently = Date.now() - oldAcc.lastLogout < 2629743000;

                if (
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
            let updateObj = { $set: account };
            await collection.updateOne({ uuid: account.uuid }, updateObj);
        })
    );
}
