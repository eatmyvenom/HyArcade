const fs = require('fs');
const oldAccounts = JSON.parse(fs.readFileSync("./accounts.json"));
let { accounts, gamers } = require("./acclist")
let players = require("./playerlist")(accounts);
let guilds = require("./guildlist")(accounts);
let status = require("./status");
const { sleep, winsSorter} = require("./utils")
 
async function updateAllAccounts(){
    // set flag for force file
    let force = fs.existsSync("./force");
    if (force) { fs.unlinkSync("./force"); }
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
            if(!oldAccounts[i] || !oldAccounts[i].wins) {
                await accounts[i].updateWins();
                // avoid hypixel rate limit
                await sleep(500);
            } else {
                // use previous wins if the player was not online
                accounts[i].wins = oldAccounts[i].wins;
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
    await updateAll();
    fs.writeFileSync("accounts.json",JSON.stringify(accounts,null,4));
    fs.writeFileSync("players.json",JSON.stringify(players,null,4));
    fs.writeFileSync("guild.json",JSON.stringify(guilds,null,4));
}

async function logNormal(name) {
    let list = JSON.parse(fs.readFileSync(`${name}.json`));
    list.sort(winsSorter);
    console.log(await txtPlayerList(list));
}

async function logG() {
    await logNormal("guild");
}

async function logP() {
    await logNormal("players");
}

async function logA() {
    await logNormal("accounts");
}

function snap() {
    guilds = JSON.parse(fs.readFileSync("guild.json"));
    players = JSON.parse(fs.readFileSync("players.json"));
    accounts = JSON.parse(fs.readFileSync("accounts.json"));
    fs.writeFileSync("accounts.day.json",JSON.stringify(accounts,null,4));
    fs.writeFileSync("players.day.json",JSON.stringify(players,null,4));
    fs.writeFileSync("guild.day.json",JSON.stringify(guilds,null,4));
}

async function logDaily(name) {
    let newlist = JSON.parse(fs.readFileSync(`${name}.json`));
    let oldlist = JSON.parse(fs.readFileSync(`${name}.day.json`));

    oldlist = oldlist.sort(winsSorter);

    for(let i=0;i<oldlist.length;i++) {
        acc = newlist.find(g=>g.name.toLowerCase()==oldlist[i].name.toLowerCase())
        if (acc) {
            oldlist[i].wins = Math.abs(oldlist[i].wins - acc.wins);
        }
    }

    // use old list to ensure that players added today 
    // don't show up with a crazy amount of daily wins
    oldlist = oldlist.sort(winsSorter);
    console.log(await txtPlayerList(oldlist));
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
    let gamerstr = '';
    let nongamers= '';
    for(let i=0;i<accounts.length;i++) {
        if(gamers.includes(accounts[i])) {
            gamerstr += await status.txtStatus(accounts[i].name);
        } else {
            nongamers += await status.txtStatus(accounts[i].name);
        }
        // make sure no more then 120 requests are sent per minute
        // this is the hypixel api limitation
        await sleep(500);
    }

    // write formatted
    fs.writeFileSync("status.txt",gamerstr + "\nNon gamers: \n\n" + nongamers);
    // write object 
    fs.writeFileSync("status.json",JSON.stringify(status.rawStatus,null,4));
}

async function genUUID() {
    let uuids = {};
    for(let i=0;i<accounts.length;i++) {
        console.log(accounts[i].name)
        uuids[accounts[i].name] = await status.getUUID(accounts[i].name);
        // make sure no more than 600 requests are sent per 10 minutes
        // this is the mojang api limitation
        await sleep(1000);
    }
    fs.writeFileSync("uuids.json", JSON.stringify(uuids,null,4));
}

// wrap main code in async function for nodejs backwards compatability

async function main(){
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
        
    }
}

main();