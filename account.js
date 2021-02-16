const https = require("https")
const apiKey = require("./config.json").key;

module.exports = class Account {
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
    // make sure player has stats to be checked
    if(!json.player || !json.player.stats || !json.player.stats.Arcade) {
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