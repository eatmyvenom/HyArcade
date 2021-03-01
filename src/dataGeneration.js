const status = require('./status');
const utils = require('./utils');
const fs = require('fs/promises');
const ffs = require('fs');
let { accounts, gamers, afkers } = require("./acclist");
const config = require('../config.json');
let force = (ffs.existsSync("./force") || config.alwaysForce);

async function genStatus() {
    // old status
    let oldstatus = JSON.parse(await fs.readFile('status.json'));
    // string at start
    let gamerstr = '';
    // string at end
    let nongamers = '';
    for(const account of accounts) {
        if(gamers.includes(account)) {
            gamerstr += await status.txtStatus(account.uuid);
        } else if(!force && afkers.includes(account)) {
            // get old status instead
            let old = oldstatus[account.uuid];
            if (old == undefined) {
                nongamers += await status.txtStatus(account.uuid);
            } else {
                nongamers += await status.genStatus(account.name, oldstatus[account.uuid]);
            }
        } else { // force true or not afker
            nongamers += await status.txtStatus(account.uuid);
        }

    };

    await Promise.all([
        // write formatted
        fs.writeFile("status.txt",gamerstr + "\nNon gamers: \n\n" + nongamers),
        // write object 
        fs.writeFile("status.json",JSON.stringify(status.rawStatus,null,4)),
        // store the cache misses
        fs.writeFile("cachemiss.json", JSON.stringify(utils.cacheMiss,null,4))
    ]);
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

    await Promise.all(accounts.map( async account => {
        // check if player is online before updating wins
        // or if the force file has been added to make sure
        // all wins are updated
        if(status.isOnlineC(account.uuid) || force) {
            await account.updateData();
        } else {
            // fallback for new accounts
            oldver = oldAccounts.find(acc => acc.uuid.toLowerCase() == account.uuid.toLowerCase());
            if(oldver != undefined) {
                // use previous wins if the player was not online
                account = oldver;
            } else {
                await account.updateData();
            }
        }
    }));
    accounts.sort(utils.winsSorter);
    return accounts;
}

module.exports = {
    genStatus : genStatus,
    updateAllAccounts : updateAllAccounts
}