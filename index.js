const fs = require('fs');
const https = require('https');
let accounts = require("./acclist")
const apiKey = require('fs').readFileSync('./key')

const Player = require('./player')(accounts);
const Account = require("./account");
const Guild = require("./guild")(accounts);

let players = [
    new Player("Als", ["als_31"]),
    new Player("Monkey", ["monkeycity17","jinglesmells1337"]),
    new Player("Ugy", ["uuujtagr_81"]),
    new Player("Pae", ["paethetic","h6es","bighairypasha","fev7","c_ck","cupoflizard"]),
    new Player("Poptart", ["mcpoptart"]),
    new Player("Shing", ["shingblad"]),
    new Player("Khan", ["KhanInTheWall"]),
    new Player("Norrie", ["norriie"]),
    new Player("Oogle", ["minecraftoogle","cute_god","CRAZYJAKE0617","ceebee83","jodie237","javiles","pandapuffz","prolapsedhole","tanman34","vibby22","xredhound","bigboyman96","clairemac13","kas61","merica49"]),
    new Player("Yung", ["yungtf"]),
    new Player("Itamar", ["itamar080607"]),
    new Player("THE77", ["ilovethe77"]),
    new Player("Jake", ["jqkeup","Faevourite"]),
    new Player("Marky", ["Markynoodle"]),
    new Player("Blatser", ["blatser"]),
    new Player("Matcha", ["Matchatw"]),
    new Player("Cryo", ["YummosChihuahua"]),
    new Player("Cheetah", ["botcheetah"]),
    new Player("Cakee", ["catgirlneko"]),
    new Player("Levy", ["HeyLevy"]),
    new Player("Fae", ["faebled"]),
    new Player("Ilomiswir", ["Ilomiswir"]),
    new Player("Wire", ["wire21"]),
    new Player("Ghostly", ["ghostly3","ghostlyboomerang","fromagepaladin","turkeycraft","jaywolvian","kokosuke","jambal","kashmoney420","n0rr1e_is_b4d","codymacke","bignick1","tigernew"]),
    new Player("BigC", ["Bigc1109","sprinngowo"]),
    new Player("Tree",["verylonelytree"]),
    new Player("pasha", ["pasha300"]),
    new Player("Rxob", ["Rxob"]),
    new Player("venom", ["v3n0m__","bruhpogchamp","wetasspoggerss","coolswaggamer","hotcheetah","eatmyvenom"]),
    new Player("Fuby", ["fubyinthecutie","Fuby"]),
    new Player("Mavis", ["mvvi"]),
    new Player("Kev", ["kvdg"]),
    new Player("Cob", ["Cobleemil"]),
    new Player("Anti", ["Atni"]),
    new Player("Kuiri", ["Kuirie"]),
    new Player("Spider", ["qSpider"]),
    new Player("Fionna", ["FionnaBalor"]),
    new Player("Hipo", ["_Hipo"]),
    new Player("Devil", ["The_DevilHimself"]),
    new Player("0name", ["0name"]),
    new Player("Juke", ["js_juke"]),
    new Player("drgen", ["drgen"]),
    new Player("Nap", ["Party_Gamer"]),
    new Player("Tab", ["Tabananaman"]),
    new Player("Neon", ["badneon"]),
    new Player("Daniez", ["Daniezowo"]),
    new Player("Zhmeva", ["zhmeva"]),
    new Player("Konan", ["Konan1010"]),
    new Player("Kyaco", ["Kyaco"]),
    new Player("Haelx", ["Haelx"]),
    new Player("Mizlynna", ["mizlynna"]),
    new Player("Edwarez", ["edwarez"]),
    new Player("Llleeee", ["llleeee"]),
    new Player("Nadel", ["_nadel_"]),
    new Player("Pingu", ["mythicalpingu"]),
    new Player("dee" , ["holidee"])
];

let guilds = [
    new Guild("Mini",0,[
        "HammyInTheWall",
        "UekuInTheWall",
        "verybad_",
        "i1a",
        "liamgonemad",
        "Tabananaman",
        "Pasha300",
        "WinInTheWall",
        "itamar080607",
        "Arcxire",
        "_Hipo",
        "USOMUSKY",
        "Blackoutburst",
        "mvvi",
        "VeryLonelyTree",
        "rxob",
        "wire21",
        "MasonInTheWall",
        "Blatser",
        "Ilomiswir",
        "bunniexoxo",        
        "qSpider",
        "Party_Gamer",
        "pastuuh",
        "yungtf",
        "steakinthewall",
        "khaninthewall",
    ]),
    new Guild("Fidelity",0,[
        "paethetic",

    ]),
    new Guild("TKJK", 0, [
        "UUUJTAGR_81",
        "jkGALAKTUS",
        "Pe3tr",
        "knacam",
        "Cukrenka",
        "FortuneLemon",
        "Aldix",
        "Krumpachnik",
        "aByee",
        "ThePoGoCZ"
    ]),
    new Guild("Cactus",0,[
        "minecraftoogle",
        "cute_god",
        "als_31",
        "catgirlneko",
        "markynoodle",
        "v3n0m__",
        "fubyinthecutie",
        "BruhPogChamp",
        "wetasspoggerss",
        "fuby",
        "coolswaggamer",
        "hotcheetah",
        "BotCheetah",
        "ghostly3",
        "Atni",
        "BadNeon",
        "kas61"
    ]),
    new Guild("sadvibes",0,[
        "jqkeup",
        "Faebled",
        "holidee"
    ]),
    new Guild("psoldiers",0,[
        "ILoveTHE77",
        "norriie"
    ]),
    new Guild("PartyGamers",0,[
        "CloverStyle",
        "DaniezOwo",
        "SkyCity17",
        "p3ppa_plg",
        "Galaxy_Senpai",
        "genkai95",
        "Chenchen87",
        "Swishfox",
        "Sebastitgames",
        "shiins",
        "0897david0897",
        "lllGhost",
        "BLKIN",
        "laura_something",
        "DarthEsme",
        "Ink0taScythe",
        "PartyGamesUpdate",
        "N0rr1e_is_b4d",
        "DrPickle_",
        "SuperMinerAAA",
        "PokemonCity17",
        "xLightW0lf",
        "Riiruu",
        "Cale73",
        "Aplanna",
        "Gigchad"
    ])
]

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
    if (status.online) {
        str += `${pname}: Type=${status.gameType}, Mode=${status.mode}\n`
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
                oldaccounts[i].wins = oldaccounts[i].wins - acc.wins;
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
