exports.players = function players(acclist) {
    let Player = require('./player')(acclist);
    
    let playerjson = require('../playerlist.json');
    let playerlist = [];
    for (let i = 0; i < playerjson.length; i++) {
        playerlist.push(new Player(playerjson[i].name,playerjson[i].accs,0))
    }
    console.log(playerlist)
    return playerlist;
}