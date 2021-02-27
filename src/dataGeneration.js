const status = require('./status');
const utils = require('./utils');
const fs = require('fs');
const oldAccounts = [].concat(JSON.parse(fs.readFileSync("./accounts.json")));
let { accounts, gamers, afkers } = require("./acclist");

// set flag for force file
let force = (fs.existsSync("./force") || config.alwaysForce);

async function genStatus() {
    // old status
    let oldstatus = JSON.parse(fs.readFileSync('status.json'));
    // string at start
    let gamerstr = '';
    // string at end
    let nongamers = '';
    for(let i = 0; i < accounts.length; i++) {
        if(gamers.includes(accounts[i])) {
            gamerstr += await status.txtStatus(accounts[i].uuid);
        } else if(!force && afkers.includes(accounts[i])) {
            // get old status instead
            let old = oldstatus[accounts[i].uuid];
            if (old == undefined) {
                nongamers += await status.txtStatus(accounts[i].uuid);
            } else {
                nongamers += await status.genStatus(accounts[i].name, oldstatus[accounts[i].uuid]);
            }
        } else { // force true or not afker
            nongamers += await status.txtStatus(accounts[i].uuid);
        }
        
    }

    // write formatted
    fs.writeFileSync("status.txt",gamerstr + "\nNon gamers: \n\n" + nongamers);
    // write object 
    fs.writeFileSync("status.json",JSON.stringify(status.rawStatus,null,4));
    // store the cache misses
    fs.writeFileSync("cachemiss.json", JSON.stringify(utils.cacheMiss,null,4));
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
    accounts.sort(utils.winsSorter);
    oldAccounts.sort(utils.winsSorter);

    for(let i=0;i<accounts.length;i++){
        let account = accounts[i];
        // check if player is online before updating wins
        // or if the force file has been added to make sure
        // all wins are updated
        if(status.isOnlineC(account.uuid) || force) {
            await account.updateData();
        } else {
            // fallback for new accounts
            oldver = oldAccounts.find(acc=>acc.uuid.toLowerCase()==account.uuid.toLowerCase());
            if(oldver != undefined) {
                // use previous wins if the player was not online
                account.wins = oldver.wins;
            } else {
                await account.updateData();
            }
        }
    }
    accounts.sort(utils.winsSorter);
    return accounts;
}

module.exports = {
    genStatus : genStatus,
    updateAllAccounts : updateAllAccounts
}