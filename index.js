const fs = require('fs');
const https = require('https');
const apiKey = "820180af-53b3-4167-90ce-68ecee2007f2"

class Player {

    name=""
    altnames=[];
    alts=[];
    wins=0;

    constructor(name, altnames, wins){
        this.name=name;
        this.altnames=altnames;
        this.wins=wins;

        for(let i=0;i<altnames.length;i++){
            this.alts.push(accounts.find(acc=>acc.name.toLowerCase()==altnames[i].toLowerCase()))
        }
    }

    async updateWins() {
        let newWins=0;
        for(let i=0;i<this.alts.length;i++) {
            newWins+=await this.alts[i].wins;
        }
        this.wins=newWins;
        return newWins;
    }
}

class Account {
    name="";
    wins=0;

    constructor(name,wins){
        this.name = name;
        this.wins = wins;
    }

    async updateWins() {
        let newWins = await getAccountWins(this.name)
        this.wins = Math.max(this.wins, newWins)
        return newWins;
    }
}

async function getAccountWins(name) {
    let data = await getAccountData(name);
    let json = JSON.parse(data);
    if(!json.player) {
        return 0;
    }
    let arcade = json.player.stats.Arcade;
    let wins = 0;
    if(arcade.wins_party) wins += arcade.wins_party;
    if(arcade.wins_party_2) wins += arcade.wins_party_2;
    if(arcade.wins_party_3) wins += arcade.wins_party_3;
    return wins;
}

function getAccountData(name) {
    return new Promise((resolve,reject)=>{
        https.get(`https://api.hypixel.net/player?key=${apiKey}&name=${name}`, res => {
            let reply='';
            res.on('data',d=>{reply+=d});
            res.on('end',()=>{resolve(reply)});
            res.on('error',err=>{reject(err)});
        });
    });
}

class Guild {
    members=[];
    name="";
    wins=0;
    constructor(name,wins,members) {
        this.name = name
        this.wins = wins;

        for(let i=0;i<members.length;i++){
            this.members.push(accounts.find(acc=>acc.name.toLowerCase()==members[i].toLowerCase()))
        }
    }

    async updateWins() {
        let newWins=0;
        for(let i=0;i<this.members.length;i++) {
            let memberwins = await this.members[i].wins;
            newWins+=memberwins;
        }
        this.wins=newWins;
        return newWins;
    }
}

let accounts = [
    new Account("als_31",0),
    new Account("MonkeyCity17",0),
    new Account("jinglesmells1337",0),
    new Account("uuujtagr_81",0),
    new Account("paethetic",0),
    new Account("h6es",0),
    new Account("bighairypasha",0),
    new Account("fev7",0),
    new Account("c_ck",0),
    new Account("cupoflizard",0),
    new Account("mcpoptart",0),
    new Account("shingblad",0),
    new Account("KhanInTheWall",0),
    new Account("norriie",0),
    new Account("minecraftoogle",0),
    new Account("cute_god",0),
    new Account("CRAZYJAKE0617",0),
    new Account("ceebee83",0),
    new Account("jodie237",0),
    new Account("javiles",0),
    new Account("pandapuffz",0),
    new Account("prolapsedhole",0),
    new Account("tanman34",0),
    new Account("vibby22",0),
    new Account("xredhound",0),
    new Account("bigboyman96",0),
    new Account("clairemac13",0),
    new Account("kas61",0),
    new Account("merica49",0),
    new Account("yungtf",0),
    new Account("itamar080607",0),
    new Account("ilovethe77",0),
    new Account("jqkeup",0),
    new Account("markynoodle",0),
    new Account("blatser",0),
    new Account("matchatw",0),
    new Account("YummosChihuahua",0),
    new Account("botcheetah",0),
    new Account("catgirlneko",0),
    new Account("heylevy",0),
    new Account("faebled",0),
    new Account("ilomiswir",0),
    new Account("wire21",0),
    new Account("ghostly3",0),
    new Account("fromagepaladin",0),
    new Account("turkeycraft",0),
    new Account("jaywolvian",0),
    new Account("kokosuke",0),
    new Account("jambal",0),
    new Account("kashmoney420",0),
    new Account("n0rr1e_is_b4d",0),
    new Account("codymacke",0),
    new Account("bignick1",0),
    new Account("tigernew",0),
    new Account("bigc1109", 0),
    new Account("sprinngowo",0),
    new Account("verylonelytree",0),
    new Account("pasha300",0),
    new Account("rxob",0),
    new Account("v3n0m__",0),
    new Account("wetasspoggerss",0),
    new Account("bruhpogchamp",0),
    new Account("coolswaggamer",0),
    new Account("eatmyvenom",0),
    new Account("hotcheetah",0),
    new Account("fubyinthecutie",0),
    new Account("fuby",0),
    new Account("mvvi",0),
    new Account("kvdg",0),
    new Account("cobleemil",0),
    new Account("atni",0),
    new Account("kuirie",0),
    new Account("qSpider",0),
    new Account("FionnaBalor",0),
    new Account("_hipo",0),
    new Account("the_devilhimself",0),
    new Account("0name",0),
    new Account("js_juke",0),
    new Account("drgen",0),
    new Account("party_gamer",0),
    new Account("tabananaman",0),
    new Account("badneon",0),
    new Account("daniezowo",0),
    new Account("zhmeva",0),
    new Account("konan1010",0),
    new Account("kyaco",0),
    new Account("haelx",0),
    new Account("mizlynna",0),
    new Account("edwarez",0),
    new Account("llleeee",0),
    new Account("_nadel_",0),
    new Account("Ghostlyboomerang",0),
    new Account("Faevourite",0),
    new Account("HammyInTheWall",0),
    new Account("UekuInTheWall",0),
    new Account("verybad_",0),
    new Account("i1a",0),
    new Account("LiamGoneMad",0),
    new Account("steakinthewall",0),
    new Account("WinInTheWall",0),
    new Account("Arcxire",0),
    new Account("USOMUSKY",0),
    new Account("Blackoutburst",0),
    new Account("MasonInTheWall",0),
    new Account("bunniexoxo",0),
    new Account("pastuuh",0),
    new Account("holidee",0),
    new Account("CloverStyle",0),
    new Account("skycity17",0),
    new Account("p3ppa_plg",0),
    new Account("Galaxy_Senpai",0),
    new Account("genkai95",0),
    new Account("Chenchen87",0),
    new Account("Swishfox",0),
    new Account("shiins",0),
    new Account("0897david0897",0),
    new Account("lllGhost",0),
    new Account("BLKIN",0),
    new Account("laura_something",0),
    new Account("DarthEsme",0),
    new Account("Ink0taScythe",0),
    new Account("PartyGamesUpdate",0),
    new Account("DrPickle_",0),
    new Account("SuperMinerAAA",0),
    new Account("PokemonCity17",0),
    new Account("xLightW0lf",0),
    new Account("Riiruu",0),
    new Account("Cale73",0),
    new Account("Aplanna",0),
    new Account("Gigchad",0),
    new Account("Sebastitgames",0),
    new Account("LoverBoyCanadian", 0),
    new Account("canadiansweat", 0),
    new Account("Musgravite", 0),
    new Account("Speedblaster",0),
    new Account("Latex_allergy",0),
    new Account("mythicalpingu",0),
    new Account("jkGALAKTUS",0),
    new Account("Pe3tr",0),
    new Account("knacam",0),
    new Account("Cukrenka",0),
    new Account("FortuneLemon",0),
    new Account("Aldix",0),
    new Account("Krumpachnik",0),
    new Account("aByee",0),
    new Account("ZenBenn",0),
    new Account("ThePoGoCZ",0),
    new Account("LunaTheRanger",0),
    new Account("Nebbens",0),
]

let afkers = [
    new Account("xHugTacos",25),
    new Account("Oblueish",28),
    new Account("TomerWB",104),
    new Account("Osunburst",12),
    new Account("Cuseno",147),
    new Account("Falsehacker",58),
    new Account("InfamousJUK3D",0),
    new Account("Hiejo",35),
    new Account("oMarc",28),
    new Account("Frightt",59),
    new Account("Pallah",0),
    new Account("DutchMark",0),
    new Account("Rowdies",53),
    new Account("SilverPat",19),
    new Account("strqnded",78),
    new Account("xArctic",55),
    new Account("ilovealice2000",49),
    new Account("kigz",38),
    new Account("Intensefy",59),
    new Account("GloriousYellow",0),
    new Account("swaggerdawg69",104),
    new Account("Cubxr",62),
    new Account("Almighty_Dab",0),
    new Account("SirFuzzyMonkey",0),
    new Account("NoHackzJustAsian",0),
    new Account("UnitxdStates",45),
    new Account("Chilled_Thunder",21),
    new Account("Bqsketball",7),
];

let important = [
    new Account("plancke",0),
    new Account("AgentKid",0),
    new Account("hypixel",0),
    new Account("SlothPixel",0),
    new Account("Plancker",0),
    new Account("Plank",0),
    new Account("SenorPancake",0),
    new Account("ZeroErrors",0),
    new Account("MasterControl",0),
    new Account("Thorlon",0),
    new Account("Sylent_",0),
    new Account("SylentButDedly",0),
    new Account("LadyBleu",0),
]

let yt = [
    new Account("Technoblade",0),
    new Account("Dream",0),
    new Account("elybeatmaker",0),
    new Account("gamerboy80",0),
    new Account("Illumina",0),
    new Account("Purpled",0),
    new Account("TapL",0),
    new Account("Zyphon_",0),
]

accounts = accounts.concat(afkers, important ,yt);

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
