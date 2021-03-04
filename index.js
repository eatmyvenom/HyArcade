#!/bin/node

const fs = require('fs/promises');
const gameAmount = require("./src/gameAmount")
const Webhook = require('./src/webhook');
const { getAccountWins, getGuildFromPlayer } = require('./src/hypixelApi');
const utils = require('./src/utils');
const dataGen = require('./src/dataGeneration');
const { getUUID } = require('./src/mojangRequest');
const { listNormal, listDiff, stringNormal, stringDaily } = require('./src/listUtils'); 
const args = process.argv;
const sleep = utils.sleep;
const logger = utils.logger;
const winsSorter = utils.winsSorter;

// So you may be wondering, "why use such a horrible config 
// format venom?" Well you see this is a nodejs project, this
// means that if I start adding all kinds of modules, this 
// will become an issue really fast. So this is my way of not
// bloating this project with node modules and shit. 
const config = require('./config.json');

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
    await utils.writeJSON("players.json", accounts);
    await utils.writeJSON("guild.json", accounts);
}

async function logNormal(name) {
    logger.out(await stringNormal(name));
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

async function logDaily(name) {
    logger.out(await stringDaily(name));
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
    return await dataGen.genStatus();
}

/**
 * @function gameAmnt - reflects the amount of players in various hypixel games
 */
async function gameAmnt() {
    // write to file so that there isnt blank files in website at any point
    await fs.writeFile('games.txt',await gameAmount.formatCounts())
}

async function newAcc() {
    let name = args[3];
    let category = args[4];
    let uuid = await getUUID(name);
    let wins = await getAccountWins(uuid);
    let acclist = require('./acclist.json');
    if (acclist[category].find(acc=>acc.uuid == uuid)) {
        logger.err("Refusing to add duplicate!");
    } else if (wins < 50 && category == 'gamers') {
        logger.err("Refusing to add account with under 50 wins to gamers!");
    }else {
        acclist[category].push({ name : name, wins : wins, uuid: uuid });
        await utils.writeJSON('./acclist.json',acclist);
        logger.out(`${name} with ${wins} wins added.`);
    }
}

async function newPlayer() {
    let name = args[3];
    let alts = args.slice(4);

    // construct object
    let playerObj = { name : name , accs : alts };

    // add object to list
    let plrlist = require('./playerlist.json');
    plrlist.push(playerObj);

    // write new list
    await utils.writeJSON('./playerlist.json', plrlist);
    logger.out(`Player "${name}" has been added with ${alts.length} alts.`)
}

async function newGuild() {
    let playerUUID = args[3];

    // get data from hypixel
    let gldInfo = JSON.parse(await getGuildFromPlayer(playerUUID));
    
    // create the actual guild object
    let id = gldInfo.guild._id;
    let name = gldInfo.guild.name;
    let gldObj = { id : id, name : name};
    
    // add object to list
    let gldLst = require('./guildlist.json');
    gldLst.push(gldObj);

    // write new list
    await utils.writeJSON('./guildlist.json', gldlLst);
    logger.out(`Guild "${name} has been added successfully.`);
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
        case 'logG':        await logG();                               break;
        case 'logA':        await logA();                               break;
        case 'logP':        await logP();                               break;
        case 'logGD':       await logGD();                              break;
        case 'logPD':       await logPD();                              break;
        case 'logAD':       await logAD();                              break;

        case 'write':       await writeFile(args);                      break;
        case 'writeD':      await writeFileD(args);                     break;

        case 'save':        await save();                               break;
        case 'snap':        await snap(args[3]);                        break;
        case 'status':      await genStatus();                          break;
        case 'discord':     await webhookLog(args[3], args[4]);         break;
        case 'discordE':    await webhookEmbed(args[3], args[4]);       break;
        case 'games':       await gameAmnt();                           break;
        case 'newAcc':      await newAcc();                             break;
        case 'newPlr':      await newPlayer();                          break;
        case 'newGuild':    await newGuild();                           break;
        case 'archive':     await archive();                            break;
    }
}

main();
