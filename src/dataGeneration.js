const status = require("./status");
const utils = require("./utils");
const fs = require("fs/promises");
const lists = require("./listParser");
const cfg = require("./Config").fromJSON();
const hypixelAPI = require("./hypixelApi");
let force = utils.fileExists("force") || cfg.alwaysForce;
const GamesPlayed = require("./gamesPlayed");
const { addAccounts } = require("./listUtils");
const { logger } = require("./utils");
const Runtime = require("./Runtime");

/**
 * Generates the status for all of the online players
 *
 */
async function genStatus() {
    let statusObj = {};
    let accdata = await utils.readJSON("accounts.json");
    let acclist = await lists.accounts();
    let accounts = acclist.accounts;

    await Promise.all(
        accounts.map(async (account) => {
            let thisdata = accdata.find((acc) => acc.uuid == account.uuid);
            if (thisdata && thisdata.isLoggedIn) {
                let response = await hypixelAPI.getStatus(account.uuid);
                statusObj[account.uuid] = response.session;
            }
        })
    );

    await Promise.all([
        // write object
        utils.writeJSON("status.json", statusObj),
        // store the cache misses
        utils.writeJSON("cachemiss.json", utils.cacheMiss),
    ]);
    await statusTxtSorted();
}

/**
 * Adds new games to the total amount of games played for each player
 *
 */
async function gamesPlayed() {
    let oldGames = await utils.readJSON("gamesPlayed.json");

    let promiseArr = accounts.map(async (account) => {
        let oldData = oldGames[account.uuid];
        let oldCounts = {};
        let oldTime = 0;

        if (oldData != undefined) {
            oldCounts = oldData.counts;
            oldTime = oldData.newestTime;
        }

        let playerGames = new GamesPlayed(account.uuid, oldCounts, oldTime);
        await playerGames.updateData();
        oldGames[account.uuid] = playerGames;
    });

    await Promise.all(promiseArr);
    await utils.writeJSON("gamesPlayed.json", oldGames);
}

async function saveBoosters() {
    let boosters = await hypixelAPI.getBoosters();
    await utils.writeJSON("boosters.json", boosters);
}

/**
 * Turn the status object into a really long formatted string
 *
 */
async function statusTxt() {
    let gamerstr = "";
    let nongamers = "";

    let accs = require("./acclist").accounts;

    let crntstatus = await utils.readJSON("status.json");
    for (const account of accs) {
        let gamerAcc = await gamers.find((acc) => acc.uuid == account.uuid);
        if (gamerAcc != undefined) {
            gamerstr += await status.genStatus(account.name, crntstatus[account.uuid]);
        } else {
            nongamers += await status.genStatus(account.name, crntstatus[account.uuid]);
        }
    }

    await fs.writeFile("status.txt", `${gamerstr}\nNon gamers:\n\n${nongamers}`);
}

async function statusTxtSorted() {
    let str = "";
    let acclist = await lists.accounts();
    let accs = acclist.accounts;

    let crntstatus = await utils.readJSON("status.json");
    const sortable = Object.entries(crntstatus).sort(statusSort).reverse();

    for (const sts of sortable) {
        let acc = await accs.find((a) => a.uuid == sts[0]);
        str += await status.genStatus(acc.name, sts[1]);
    }

    await fs.writeFile("status.txt", `${str}`);
}

function statusSort(a, b) {
    let status1 = a[1];
    let status2 = b[1];

    // sanitize
    status1.mode = ("" + status1.mode).toUpperCase();
    status2.mode = ("" + status2.mode).toUpperCase();
    status1.gameType = ("" + status1.gameType).toUpperCase();
    status2.gameType = ("" + status2.gameType).toUpperCase();

    if (status1.mode == "LOBBY" && status2.mode != "LOBBY") {
        return -1;
    }
    if (status2.mode == "LOBBY" && status1.mode != "LOBBY") {
        return 1;
    }
    if (status1.mode == "PARTY" && status2.mode != "PARTY") {
        return 1;
    }
    if (status2.mode == "PARTY" && status1.mode != "PARTY") {
        return -1;
    }
    if (status1.mode == "FARM_HUNT" && status2.mode != "FARM_HUNT") {
        return 1;
    }
    if (status2.mode == "FARM_HUNT" && status1.mode != "FARM_HUNT") {
        return -1;
    }
    if (status1.gameType == "ARCADE" && status2.gameType != "ARCADE") {
        return 1;
    }
    if (status2.gameType == "ARCADE" && status1.gameType != "ARCADE") {
        return -1;
    }
    if (status1.gameType == "SKYBLOCK" && status2.mode != "SKYBLOCK") {
        return -1;
    }
    if (status2.gameType == "SKYBLOCK" && status1.mode != "SKYBLOCK") {
        return 1;
    }
    if (status1.gameType > status2.gameType) {
        return -1;
    }
    if (status1.gameType < status2.gameType) {
        return 1;
    }
    if (status1.mode > status2.mode) {
        return -1;
    }
    if (status1.mode < status2.mode) {
        return 1;
    }
    if (a[0] > b[0]) {
        return 1;
    }
    if (b[0] > a[0]) {
        return -1;
    }
    return 0;
}

/**
 * Update the player data for all players in the list
 *
 * @return {Account[]}
 */
async function updateAllAccounts() {
    let acclist = await lists.accounts();
    let accounts = acclist.accounts;
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

    if(utils.fileExists("data/accounts.json.full")) {
        let fullList = await utils.readJSON("accounts.json.full");
        await fs.rm("data/accounts.json.full");
        for(let i = 0; i < accounts.length; i++) {
            let acc = accounts[i];
            let newAcc = fullList.find(a=>a.uuid==acc.uuid);
            if(newAcc.xp > acc.xp) {
                logger.out(`Setting ${newAcc}'s data from outside source!`);
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
    return accounts;
}

async function updateAccountsInArr(accounts, oldAccs) {
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

                if (isLinked || (aboveArcadeLimit && fbOutsideCringeLimit && mwOutsideCringeLimit && hasPlayedRecently)) {
                    logger.out(`Updating ${oldAcc.name}'s data`);
                    await account.updateData();
                } else {
                    logger.out(`Ignoring ${oldAcc.name} for this refresh`)
                    account.setData(oldAcc);
                }
            } else {
                await account.updateData();
            }
        })
    );
}

async function addLeaderboards() {
    let leaders = await hypixelAPI.getLeaderboards();
    let arcade = leaders.leaderboards.ARCADE;
    let lifetimeCoins = arcade[0].leaders;
    let monthlyCoins = arcade[2].leaders;
    let weeklyCoins = arcade[1].leaders;

    await addAccounts("others", lifetimeCoins);
    await addAccounts("others", monthlyCoins);
    await addAccounts("others", weeklyCoins);
}

async function addGuild(uuid) {
    let guild = JSON.parse(await hypixelAPI.getGuildFromPlayer(uuid));
    let members = guild.guild.members;
    let uuids = [];
    for (let m of members) {
        uuids.push(m.uuid);
    }

    await addAccounts("others", uuids);
}

async function addGuildID(id) {
    let guild = JSON.parse(await hypixelAPI.getGuildRaw(id));
    let members = guild.guild.members;
    let uuids = [];
    for (let m of members) {
        uuids.push(m.uuid);
    }

    await addAccounts("others", uuids);
}

module.exports = {
    genStatus: genStatus,
    updateAllAccounts: updateAllAccounts,
    statusTxtSorted: statusTxtSorted,
    gamesPlayed: gamesPlayed,
    addGuild: addGuild,
    addGuildID: addGuildID,
    addLeaderboards: addLeaderboards,
    saveBoosters: saveBoosters,
};
