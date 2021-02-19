const fs = require('fs');
const oldAccounts = JSON.parse(fs.readFileSync("./accounts.json"));
const { sleep, winsSorter } = require("./utils")
const Webhook = require('./webhook');
const gameAmount = require("./gameAmount")
let { accounts, gamers, afkers } = require("./acclist");
// a module that exports an array of player objects from the player module
let players = require("./playerlist")(accounts);
let guilds = require("./guildlist")(accounts);
let status = require("./status");
// set flag for force file
let force = fs.existsSync("./force");
if (force) { fs.unlinkSync("./force"); }

async function updateAllAccounts(){
    // sort this before hand because otherwise everything dies
    // like seriously holy fuck its so bad
    // oogle ended up with 21k wins due to this bug
    // do not remove this
    // people will notice
    // just take the extra time
    sortAccounts();
    oldAccounts.sort(winsSorter);

    for(let i=0;i<accounts.length;i++){
        // check if player is online before updating wins
        // or if the force file has been added to make sure
        // all wins are updated
        if(status.isOnlineC(accounts[i].name) || force) {
            await accounts[i].updateWins();
            // avoid hypixel rate limit
            await sleep(500);
        } else {
            // fallback for new accounts
            oldver = oldAccounts.find(g=>g.name.toLowerCase()==accounts[i].name.toLowerCase())
            if(oldver != undefined) {
                // use previous wins if the player was not online
                accounts[i].wins = oldver.wins;
            } else {
                await accounts[i].updateWins();
                // avoid hypixel rate limit
                await sleep(500);
            }
        }
    }
    sortAccounts();
}

async function updateAllPlayers() {
    for(let i=0;i<players.length;i++){
        await players[i].updateWins();
    }

    sortPlayers();
}

async function updateAllGuilds() {
    for(let i=0;i<guilds.length;i++){
        await guilds[i].updateWins();
    }

    sortGuilds();
}

// just some wrappers because this was abstracted

function sortPlayers() {
    players.sort(winsSorter);
}

function sortGuilds() {
    guilds.sort(winsSorter);
}

function sortAccounts() {
    accounts.sort(winsSorter);
}

async function updateAll() {
    await updateAllAccounts();
    await updateAllPlayers();
    await updateAllGuilds();
}

async function txtPlayerList(list){
    let str="";
    for(let i=0;i<list.length;i++){
        // don't print if player has 0 wins
        if(list[i].wins<1) continue;
        
        // this hack is because js has no real string formatting and its
        // not worth it to use wasm or nodenative for this
        let num = ("000"+(i+1)).slice(-3);
        let name = (list[i].name.slice(0,1).toUpperCase() + list[i].name.slice(1) + "                     ").slice(0,15);
        str+=`${num}) ${name}: ${list[i].wins}\n`;
    }
    return str;
}

async function save() {
    // get up to date info
    await updateAll();
    // write new data to json files to be used later
    fs.writeFileSync("accounts.json",JSON.stringify(accounts,null,4));
    fs.writeFileSync("players.json",JSON.stringify(players,null,4));
    fs.writeFileSync("guild.json",JSON.stringify(guilds,null,4));
}

async function stringNormal(name) {
    let list = JSON.parse(fs.readFileSync(`${name}.json`));
    list.sort(winsSorter);
    return await txtPlayerList(list);
}

async function logNormal(name) {
    console.log(await stringNormal(name));
}

// wrappers because I abstracted this
async function logG() {
    await logNormal("guild");
}

async function logP() {
    await logNormal("players");
}

async function logA() {
    await logNormal("accounts");
}

async function snap() {

    // send webhook messages, this is only currently 
    // in a small server and only does the unofficial 
    // leaderboard, this can be easily changed and if
    // someone else would like I can add this to 
    // another server
    await Webhook.send(await stringNormal("players"));
    await Webhook.send(await stringDaily("players"));

    // move all the current stats files to be the daily files
    guilds = JSON.parse(fs.readFileSync("guild.json"));
    players = JSON.parse(fs.readFileSync("players.json"));
    accounts = JSON.parse(fs.readFileSync("accounts.json"));
    fs.writeFileSync("accounts.day.json",JSON.stringify(accounts,null,4));
    fs.writeFileSync("players.day.json",JSON.stringify(players,null,4));
    fs.writeFileSync("guild.day.json",JSON.stringify(guilds,null,4));
}

async function stringDaily(name) {
    let newlist = JSON.parse(fs.readFileSync(`${name}.json`));
    let oldlist = JSON.parse(fs.readFileSync(`${name}.day.json`));

    // sort the list before hand
    oldlist = oldlist.sort(winsSorter);

    for(let i=0;i<oldlist.length;i++) {
        acc = newlist.find(g=>g.name.toLowerCase()==oldlist[i].name.toLowerCase())
        // make sure acc isnt null/undefined
        if (acc) {
            // this uses abs in case there is some other error along the way
            oldlist[i].wins = Math.abs(oldlist[i].wins - acc.wins);
        }
    }

    // use old list to ensure that players added today 
    // don't show up with a crazy amount of daily wins
    oldlist = oldlist.sort(winsSorter);
    return await txtPlayerList(oldlist);
}

async function logDaily(name) {
    console.log(await stringDaily(name));
}

async function logGD() {
    await logDaily("guild");
}

async function logPD() {
    await logDaily("players");
}

async function logAD() {
    await logDaily("accounts");
}

async function genStatus() {
    // old status
    let oldstatus = JSON.parse(fs.readFileSync('./status.json'));
    // string at start
    let gamerstr = '';
    // string at end
    let nongamers = '';
    for(let i = 0; i < accounts.length; i++) {
        if(gamers.includes(accounts[i])) {
            gamerstr += await status.txtStatus(accounts[i].name);
        } else {
            if(!force || afkers.includes(accounts[i])) {
                nongamers += await status.genStatus(oldstatus[accounts[i].name]);
            } else {
                nongamers += await status.txtStatus(accounts[i].name);
            }
        }
        // make sure no more then 120 requests are sent per minute
        // this is the hypixel api limitation
        await sleep(500);
    }

    // write formatted
    fs.writeFileSync("status.txt",gamerstr + "\nNon gamers: \n\n" + nongamers);
    // write object 
    fs.writeFileSync("status.json",JSON.stringify(status.rawStatus,null,4));
    // store the cache misses
    fs.writeFileSync("cachemiss.json", JSON.stringify(status.cacheMiss,null,4));
}

/**
 * @function - Generate uuids for all the accounts in the accounts list
 * @see acclist
 */
async function genUUID() {
    let uuids = {};
    for(let i = 0; i<accounts.length; i++) {
        // since stdout isnt piped into something else, a log here is 
        // harmless
        console.log(accounts[i].name)
        uuids[accounts[i].name] = await status.getUUID(accounts[i].name);
        // make sure no more than 600 requests are sent per 10 minutes
        // this is the mojang api limitation
        await sleep(1000);
    }
    fs.writeFileSync("uuids.json", JSON.stringify(uuids,null,4));
}

/**
 * @function gameAmnt - reflects the amount of players in various hypixel games
 */
async function gameAmnt() {
    await gameAmount.logCounts();
}

// wrap main code in async function for nodejs backwards compatability

async function main(){
    // im lazy
    let args = process.argv;

    // use different functions for different args
    // switch has one x86 instruction vs multiple for if statements
    switch (args[2]) {
        case 'save':    await save();      break;
        case 'logG':    await logG();      break;
        case 'logA':    await logA();      break;
        case 'logP':    await logP();      break;
        case 'snap':    await snap();      break;
        case 'logGD':   await logGD();     break;
        case 'logPD':   await logPD();     break;
        case 'logAD':   await logAD();     break;
        case 'status':  await genStatus(); break;
        case 'genUUID': await genUUID();   break;
        case 'games':   await gameAmnt();  break;
    }
}

main();