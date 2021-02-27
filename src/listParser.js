const Account = require('./account');

exports.players = function players(acclist) {
    let Player = require('./player')(acclist);
    
    let playerjson = require('../playerlist.json');
    let playerlist = [];
    for (let i = 0; i < playerjson.length; i++) {
        playerlist.push(new Player(playerjson[i].name,playerjson[i].accs,0))
    }
    return playerlist;
}

exports.accounts = function accounts() {
    let acclistjson = require('../acclist.json');
    let acclist = {};

    for ( const sublist in acclistjson) {
        let currentlist = [];
        for ( const args of acclistjson[sublist] ) {
            currentlist.push(new Account(args.name, args.wins, args.uuid));
        }
        acclist[sublist] = currentlist;
    }
    acclist.accounts = acclist.gamers.concat(acclist.others, acclist.afkers, acclist.important ,acclist.yt, acclist.pog)
    return acclist;
}

exports.guilds = function gld(accs) {
    let accounts = accs;
    let Guild = require("./guild")(accounts);
    let guildlistjson = require("../guildlist.json");
    let realList = [];

    for (const guild of guildlistjson) {
        realList.push(new Guild(guild.name,guild.id))
    }
    return realList;
}
