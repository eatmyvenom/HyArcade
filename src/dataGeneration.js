const status = require('./status');
const utils = require('./utils');
const fs = require('fs/promises');
const ffs = require('fs');
let { accounts, gamers, afkers } = require("./acclist");
const config = require('../config.json');
const hypixelAPI = require('./hypixelApi');
let force = (ffs.existsSync("./force") || config.alwaysForce);

async function genStatus() {
    // old status

    let statusObj = {};
    let oldstatus = JSON.parse(await fs.readFile('status.json'));
    await Promise.all( accounts.map( async account => {
        if(gamers.includes(account)) {
            statusObj[account.uuid] = JSON.parse(await hypixelAPI.getStatusRAW(account.uuid)).session;
        } else if(!force && afkers.includes(account)) {
            // get old status instead
            let old = oldstatus[account.uuid];
            // datafixer
            old = old.session ? old.session : old;
            if (old == undefined) {
                statusObj[account.uuid] = JSON.parse(await hypixelAPI.getStatusRAW(account.uuid)).session;
            } else {
                statusObj[account.uuid] = old
            }
        } else { // force true or not afker
            statusObj[account.uuid] = JSON.parse(await hypixelAPI.getStatusRAW(account.uuid)).session;
        }
    }));

    await Promise.all([
        // write object 
        fs.writeFile("status.json",JSON.stringify(statusObj,null,4)),
        // store the cache misses
        fs.writeFile("cachemiss.json", JSON.stringify(utils.cacheMiss,null,4))
    ]);
    await statusTxt();
}

async function statusTxt() {
    let gamerstr = "";
    let nongamers = "";

    let accs = require('../accounts.json')

    let crntstatus = JSON.parse(await fs.readFile('status.json'));
    for(const account of accs) {
        if(gamers.find(acc=>acc.uuid==account.uuid)!=undefined) {
            gamerstr += await status.genStatus(account.name, crntstatus[account.uuid]);
        } else {
            nongamers += await status.genStatus(account.name, crntstatus[account.uuid]);
        }
    }

    await fs.writeFile("status.txt",`${gamerstr}\nNon gamers:\n\n${nongamers}`,null,4);
}

async function updateAllAccounts(accounts){
    // sort this before hand because otherwise everything dies
    // like seriously holy fuck its so bad
    // oogle ended up with 21k wins due to this bug
    // do not remove this
    // people will notice
    // just take the extra time
    // ...
    // okay maybe its redundant now
    const oldAccounts = JSON.parse(await fs.readFile("./accounts.json"))
    accounts.sort(utils.winsSorter);
    oldAccounts.sort(utils.winsSorter);

    // Yes, this is abusive to the api, but also consider this
    // SPEEEEEEEEDDD
    await Promise.all(accounts.map( async account => {
        // check if player is online before updating wins
        // or if the force file has been added to make sure
        // all wins are updated
        oldver = await oldAccounts.find(acc => acc.uuid.toLowerCase() == account.uuid.toLowerCase());
        if(status.isOnlineC(account.uuid) || force) {
            await account.updateData();
        } else {
            if(oldver != undefined) {
                // use previous data if player is offline
                account.wins                = oldver.wins;
                account.name                = oldver.name;
                account.uuid                = oldver.uuid;
                account.rank                = oldver.rank;
                account.version             = oldver.version;
                account.mostRecentGameType  = oldver.mostRecentGameType;
                account.xp                  = oldver.xp;
                account.hitwQual            = oldver.hitwQual;
                account.hitwFinal           = oldver.hitwFinal;
                account.farmhuntWins        = oldver.farmhuntWins;
            } else {
                // fallback for new accounts
                await account.updateData();
            }
        }
    }));
    await accounts.sort(utils.winsSorter);
    return accounts;
}

module.exports = {
    genStatus : genStatus,
    updateAllAccounts : updateAllAccounts
}