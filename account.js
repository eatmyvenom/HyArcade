const { getAccountDataRaw } = require('./hypixelRequest');

module.exports = class Account {
    name="";
    wins=0;
    uuid="";

    constructor(name,wins,uuid){
        this.name = name;
        this.wins = wins;
        this.uuid = uuid;
    }

    async updateWins() {
        let newWins = await getAccountWins(this.uuid)
        this.wins = Math.max(this.wins, newWins)
        return newWins;
    }
}

async function getAccountWins(name) {
    let data = await getAccountDataRaw(name);
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
