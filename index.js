const fs = require('fs');
const https = require('https');
let accounts = require("./acclist")
const apiKey = require('fs').readFileSync('./key')

const Player = require('./player')(accounts);
const Account = require("./account");
const Guild = require("./guild")(accounts);

let players = require("./playerlist")(accounts);
let guilds = require("./guildlist")(accounts)

let rawstatus = {};

function sleep(time) {
    return new Promise((resolve) =>{
        setTimeout(resolve,time);
    });
}

async function updateAllAccounts(){
    for(let i=0;i<accounts.length;i++){
        await accounts[i].updateWins();
        await sleep(500);
    }
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

function winsSorter(a,b) {
    if(a.wins < b.wins) return 1;
    if(a.wins > b.wins) return -1;
    return 0;
}

async function updateAll() {
    await updateAllAccounts();
    await updateAllPlayers();
    await updateAllGuilds();
}

async function txtPlayerList(list){
    let str="";
    for(let i=0;i<list.length;i++){
        if(list[i].wins<1) continue;
        let num = ("000"+(i+1)).slice(-3);
        let name = (list[i].name.slice(0,1).toUpperCase() + list[i].name.slice(1) + "                     ").slice(0,15);
        str+=`${num}) ${name}: ${list[i].wins}\n`;
    }
    return str;
}

async function txtStatus(name) {
    let status = await getStatus(name);
    let str='';
    if(!status) {
        return "";
    }

    let pname = (name.slice(0,1).toUpperCase() + name.slice(1) + "                        ").slice(0,17);
    rawstatus[name]=status;
    if (status.online) {
        str += `${pname}: `
        if(status.mode == 'LOBBY') {
            str += `${status.gameType.toLowerCase()} ${status.mode.toLowerCase()}`
        } else if (status.gameType == 'DUELS') {
            str += `${status.mode} - ${status.map}`
        } else if (status.gameType == 'ARCADE') {
            if (status.mode == "FARM_HUNT") {
                str += "Farm hunt - "
            } else if (status.mode == "PVP_CTW") {
                str += "Ctw - "
            } else if (status.mode == "MINI_WALLS") {
                str += "Mini walls - "
            } else if (status.mode.includes("HIDE_AND_SEEK")) {
                str += `${status.mode.replace("HIDE_AND_SEEK","").toLowerCase.replace("_"," ")}`
            }
            else if (status.mode.includes("ZOMBIES")) {
                str += `Zombies ${status.mode.replace("Zombies","").toLowerCase.replace("_"," ")}`
            }
            str += `${status.map}`
        } else if (status.gameType == 'BEDWARS') {
            str += `Bedwars ${status.mode.toLowerCase().replace('_',' ')} - ${status.map}`
        } else if (status.gameType == 'TNTGAMES') {
            str += `Tnt ${status.mode.toLowerCase()} - ${status.map}`
        } else if (status.gameType == 'BUILD_BATTLE') {
            str += `${status.map}`
        } else if (status.gameType == 'HOUSING') {
            str += `Housing ${status.map}`
        } else if (status.gameType == 'SKYBLOCK' && status.mode == "dynamic") {
            str += `Skyblock island`
        } else {
            str += `${status.gameType} ${status.mode}`
        }
        str += "\n"
     } else {
        return "";
    }
    
    return str
}

function getUUIDFromCache(name) {
    return JSON.parse(fs.readFileSync("uuids.json"))[name]
}

async function getStatus(name) {
    let uuid = await getUUIDFromCache(name);
    if(!uuid) {
        uuid = getUUID(name);
    }
    
    if(!uuid) {
        return undefined;
    }
    let raw = await getStatusRAW(uuid);
    let json = JSON.parse(raw);
    return json.session;
}

async function getUUID(name) {
    let raw = await getUUIDRaw(name);
    if(raw!="") {
        return JSON.parse(raw).id
    } else {
        return undefined;
    }
}

async function getUUIDRaw(name) {
    return new Promise((resolve,reject)=>{
        https.get(`https://api.mojang.com/users/profiles/minecraft/${name}`, res => {
            let reply='';
            res.on('data',d=>{reply+=d});
            res.on('end',()=>{resolve(reply)});
            res.on('error',err=>{reject(err)});
        });
    });
}

async function getStatusRAW(UUID) {
    return new Promise((resolve,reject)=>{
        https.get(`https://api.hypixel.net/status?key=${apiKey}&uuid=${UUID}`, res => {
            let reply='';
            res.on('data',d=>{reply+=d});
            res.on('end',()=>{resolve(reply)});
            res.on('error',err=>{reject(err)});
        });
    });
}

async function main(){
    let args = process.argv;
    let arg1 = args[2];

    if(arg1=='save') {
        await updateAll();
        fs.writeFileSync("accounts.json",JSON.stringify(accounts,null,4));
        fs.writeFileSync("players.json",JSON.stringify(players,null,4));
        fs.writeFileSync("guild.json",JSON.stringify(guilds,null,4));
    } else if (arg1=='logG') {
        guilds = JSON.parse(fs.readFileSync("guild.json"));
        console.log(await txtPlayerList(guilds));
    } else if (arg1=='logP') {
        players = JSON.parse(fs.readFileSync("players.json"));
        console.log(await txtPlayerList(players));
    } else if (arg1=='logA') {
        accounts = JSON.parse(fs.readFileSync("accounts.json"));
        sortAccounts();
        console.log(await txtPlayerList(accounts));
    } else if (arg1=='snap') {
        guilds = JSON.parse(fs.readFileSync("guild.json"));
        players = JSON.parse(fs.readFileSync("players.json"));
        accounts = JSON.parse(fs.readFileSync("accounts.json"));
        fs.writeFileSync("accounts.day.json",JSON.stringify(accounts,null,4));
        fs.writeFileSync("players.day.json",JSON.stringify(players,null,4));
        fs.writeFileSync("guild.day.json",JSON.stringify(guilds,null,4));
    } else if (arg1=='logGD') {
        guilds = JSON.parse(fs.readFileSync("guild.json"));
        let oldguilds = JSON.parse(fs.readFileSync("guild.day.json"));

        for(let i=0;i<oldguilds.length;i++) {
            guilds.find(g=>g.name==oldguilds[i].name).wins-=oldguilds[i].wins;
        }
        sortGuilds();
        console.log(await txtPlayerList(guilds))
    } else if (arg1=='logPD') {
        players = JSON.parse(fs.readFileSync("players.json"));
        let oldplayers = JSON.parse(fs.readFileSync("players.day.json"));

        for(let i=0;i<oldplayers.length;i++) {
            players.find(g=>g.name.toLowerCase()==oldplayers[i].name.toLowerCase()).wins-=oldplayers[i].wins;
        }
        sortPlayers();
        console.log(await txtPlayerList(players))
    } else if (arg1=='logAD') {
        accounts = JSON.parse(fs.readFileSync("accounts.json"));
        let oldaccounts = JSON.parse(fs.readFileSync("accounts.day.json"));

        oldaccounts = oldaccounts.sort(winsSorter);

        for(let i=0;i<oldaccounts.length;i++) {
            acc = accounts.find(g=>g.name.toLowerCase()==oldaccounts[i].name.toLowerCase())
            if (acc) {
                oldaccounts[i].wins = Math.abs(oldaccounts[i].wins - acc.wins);
            }
        }
        oldaccounts = oldaccounts.sort(winsSorter);
        console.log(await txtPlayerList(oldaccounts))
    } else if (arg1=='status') {
        let str = '';
        for(let i=0;i<accounts.length;i++) {
            str += await txtStatus(accounts[i].name);
            await sleep(500);
        }
        fs.writeFileSync("status.txt",str);
        fs.writeFileSync("status.json",JSON.stringify(rawstatus,null,4));
    } else if (arg1=='genUUID') {
        let uuids = {};
        for(let i=0;i<accounts.length;i++) {
            console.log(accounts[i].name)
            uuids[accounts[i].name] = await getUUID(accounts[i].name);
            await sleep(1000);
        }
        fs.writeFileSync("uuids.json", JSON.stringify(uuids,null,4));
    }
}

main();
