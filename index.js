#!/bin/node

const fs = require('fs');
const oldAccounts = JSON.parse(fs.readFileSync("./accounts.json"));
const gameAmount = require("./src/gameAmount")
const Webhook = require('./src/webhook');
const config = require('./config.json');
const { sleep, winsSorter } = require("./src/utils")
const { getUUID } = require('./src/mojangRequest');
const { getAccountWins } = require('./src/hypixelRequest');
const args = process.argv[0] == '/usr/bin/node' ? process.argv : ['node'].concat(process.argv)
const utils = require('./src/utils');

let { accounts, gamers, afkers } = require("./src/acclist");

// a module that exports an array of player objects from the player module
let players = require("./src/playerlist")(accounts);
let guilds = require("./src/guildlist")(accounts);
let status = require("./src/status");

// set flag for force file
let force = (fs.existsSync("./force") || config.alwaysForce);

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
        } else {
            // fallback for new accounts
            oldver = oldAccounts.find(g=>g.name.toLowerCase()==accounts[i].name.toLowerCase())
            if(oldver != undefined) {
                // use previous wins if the player was not online
                accounts[i].wins = oldver.wins;
            } else {
                await accounts[i].updateWins();
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
        if(list[i].wins<1 || config.printAllWins) continue;
        
        // this hack is because js has no real string formatting and its
        // not worth it to use wasm or nodenative for this
        let num = ("000"+(i+1)).slice(-3);
        let name = (list[i].name.slice(0,1).toUpperCase() + list[i].name.slice(1) + "                       ").slice(0,17);
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

async function webhookLog(type = 'players') {
    // send webhook messages, this is only currently 
    // in a small server and only does the unofficial 
    // leaderboard, this can be easily changed and if
    // someone else would like I can add this to 
    // another server

    await Webhook.send(await stringNormal(type));
    await Webhook.send(await stringDaily(type));
}

/**
 * This is here because i abstracted this to archive
 * @param {String} timeType - the inbetween of the file
 */
async function snap(timeType = 'day') {
    // move all the current stats files to be the daily files
    await archive('./',timeType);
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
            oldlist[i].wins = acc.wins - oldlist[i].wins;
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

//more abstracted methods

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
    let oldstatus = JSON.parse(fs.readFileSync('status.json'));
    // string at start
    let gamerstr = '';
    // string at end
    let nongamers = '';
    for(let i = 0; i < accounts.length; i++) {
        if(gamers.includes(accounts[i])) {
            gamerstr += await status.txtStatus(accounts[i].name);
        } else if(!force && afkers.includes(accounts[i])) {
            // get old status instead
            let old = oldstatus[accounts[i].name];
            if (old == undefined) {
                nongamers += await status.txtStatus(accounts[i].name);
            } else {
                nongamers += await status.genStatus(accounts[i].name, oldstatus[accounts[i].name]);
            }
        } else { // force true or not afker
            nongamers += await status.txtStatus(accounts[i].name);
        }
        
    }

    // write formatted
    fs.writeFileSync("status.txt",gamerstr + "\nNon gamers: \n\n" + nongamers);
    // write object 
    fs.writeFileSync("status.json",JSON.stringify(status.rawStatus,null,4));
    // store the cache misses
    fs.writeFileSync("cachemiss.json", JSON.stringify(utils.cacheMiss,null,4));
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
        uuids[accounts[i].name] = await getUUID(accounts[i].name);
        // make sure no more than 600 requests are sent per 10 minutes
        // this is the mojang api limitation
        await sleep(config.mojang.sleep);
    }
    fs.writeFileSync("uuids.json", JSON.stringify(uuids,null,4));
}

/**
 * @function gameAmnt - reflects the amount of players in various hypixel games
 */
async function gameAmnt() {
    await gameAmount.logCounts();
}

async function newAcc() {
    let name = args[3]
    let uuid = await getUUID(name);
    let wins = await getAccountWins(uuid);
    let formattedname = ('"'+name+'",                         ').slice(0,20)
    let formattedWins = (wins+',   ').slice(0,4);
    console.log(`new Account(${formattedname}${formattedWins}"${uuid}"),`);
}

async function archive(path = './archive/', timeType = utils.day()) {
    await utils.archiveJson('guild',path,timetype);
    await utils.archiveJson('players',path,timetype);
    await utils.archiveJson('accounts',path,timetype);
}

// wrap main code in async function for nodejs backwards compatability

async function main(){
    // use different functions for different args
    // switch has one x86 instruction vs multiple for if statements
    switch (args[2]) {
        case 'save':        await save();           break;
        case 'logG':        await logG();           break;
        case 'logA':        await logA();           break;
        case 'logP':        await logP();           break;
        case 'logGD':       await logGD();          break;
        case 'logPD':       await logPD();          break;
        case 'logAD':       await logAD();          break;
        case 'snap':        await snap(args[3]);    break;
        case 'status':      await genStatus();      break;
        case 'discord':     await webhookLog();     break;
        case 'genUUID':     await genUUID();        break;
        case 'games':       await gameAmnt();       break;
        case 'newAcc':      await newAcc();         break;
        case 'archive':     await archive();        break;
    }
}

main();