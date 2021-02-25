const { getAccountWins } = require('./hypixelApi');

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