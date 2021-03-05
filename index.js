#!/bin/node

const fs = require('fs/promises');
const gameAmount = require("./src/gameAmount")
const Webhook = require('./src/webhook');
const utils = require('./src/utils');
const dataGen = require('./src/dataGeneration');
const cli = require('./src/cli');
const { listNormal, listDiff, stringNormal, stringDaily } = require('./src/listUtils'); 
const args = process.argv;
const winsSorter = utils.winsSorter;

// So you may be wondering, "why use such a horrible config 
// format venom?" Well you see this is a nodejs project, this
// means that if I start adding all kinds of modules, this 
// will become an issue really fast. So this is my way of not
// bloating this project with node modules and shit. 

let { accounts } = require("./src/acclist");

// these modules need to use identical accounts lists so that 
// the data does not need to be updated multiple times
let players = require("./src/playerlist")(accounts);
let guilds = require("./src/guildlist")(accounts);

async function updateAllAccounts(){
    accounts = await dataGen.updateAllAccounts(accounts);
}

async function updateAllPlayers() {
    await Promise.all( players.map ( async player => { await player.updateWins() } ) )

    sortPlayers();
}

async function updateAllGuilds() {
    await Promise.all( guilds.map ( async guild => { await guild.updateWins() } ) )

    sortGuilds();
}

// just some wrappers because this was abstracted

function sortPlayers() {
    players.sort(winsSorter);
}

function sortGuilds() {
    guilds.sort(winsSorter);
}

async function updateAll() {
    await updateAllAccounts();
    await updateAllPlayers();
    await updateAllGuilds();
}

async function save() {
    // get up to date info
    await updateAll();
    // write new data to json files to be used later
    await utils.writeJSON("accounts.json", accounts);
    await utils.writeJSON("players.json", players);
    await utils.writeJSON("guild.json", guilds);
}

async function webhookLog(type = 'players', maxamnt) {
    // send webhook messages, this is only currently 
    // in a small server and only does the unofficial 
    // leaderboard, this can be easily changed and if
    // someone else would like I can add this to 
    // another server

    await Webhook.send(await stringNormal(type, maxamnt));
    await Webhook.send(await stringDaily(type, maxamnt));
}

async function webhookEmbed(type = 'players', maxamnt) {
    // send webhook messages, this is only currently 
    // in a small server and only does the unofficial 
    // leaderboard, this can be easily changed and if
    // someone else would like I can add this to 
    // another server

    let normal = await listNormal(type,maxamnt);
    let day = await listDiff(type,'day',maxamnt);

    await Webhook.sendEmbed("WINS", normal);
    await Webhook.sendEmbed("DAILY", day);
}

/**
 * This is here because i abstracted this to archive
 * @param {String} timeType - the inbetween of the file
 */
async function snap(timeType = 'day') {
    // move all the current stats files to be the daily files
    await archive('./',timeType);
}

async function genStatus() {
    return await dataGen.genStatus();
}

/**
 * @function gameAmnt - reflects the amount of players in various hypixel games
 */
async function gameAmnt() {
    // write to file so that there isnt blank files in website at any point
    await fs.writeFile('games.txt',await gameAmount.formatCounts())
}

async function archive(path = './archive/', timetype = utils.day()) {
    await Promise.all([
        utils.archiveJson('guild',path,timetype),
        utils.archiveJson('players',path,timetype),
        utils.archiveJson('accounts',path,timetype)
    ])
}

async function writeFile(args) {
    let logName = args[3];
    let location = args[4];
    let str = await stringNormal(logName) 

    await fs.writeFile(location,str);
}

async function writeFileD(args) {
    let logName = args[3];
    let location = args[4];
    let str = await stringDaily(logName);

    await fs.writeFile(location,str);
}

// wrap main code in async function for nodejs backwards compatability

async function main(){
    // use different functions for different args
    // switch has one x86 instruction vs multiple for if statements
    switch (args[2]) {
        case 'logG':        await cli.logNormal("guild");               break;
        case 'logA':        await cli.logNormal("accounts");            break;
        case 'logP':        await cli.logNormal("players");             break;
        
        case 'logGD':       await cli.logDaily("guild");                break;
        case 'logAD':       await cli.logDaily("accounts");             break;
        case 'logPD':       await cli.logDaily("players");              break;

        case 'log':         await cli.log(args);                        break;
        case 'logD':        await cli.logD(args);                       break;

        case 'write':       await writeFile(args);                      break;
        case 'writeD':      await writeFileD(args);                     break;

        case 'save':        await save();                               break;
        case 'snap':        await snap(args[3]);                        break;
        case 'archive':     await archive();                            break;

        case 'status':      await genStatus();                          break;
        
        case 'games':       await gameAmnt();                           break;
        
        case 'discord':     await webhookLog(args[3], args[4]);         break;
        case 'discordE':    await webhookEmbed(args[3], args[4]);       break;
       
        case 'names':       await cli.checkNames();                     break;
       
        case 'newAcc':      await cli.newAcc();                         break;
        case 'newPlr':      await cli.newPlayer();                      break;
        case 'newGuild':    await cli.newGuild();                       break;
    }
}

main();