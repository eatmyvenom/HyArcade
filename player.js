let accounts =[];

module.exports = function Plr(acclist) {
    accounts=acclist;
    return Player;
}

class Player {

    name = ""
    altnames = [];
    alts = [];
    wins = 0;

    constructor(name, altnames, wins){
        this.name = name;
        this.altnames = altnames;
        this.wins = wins;

        for(let i = 0; i < altnames.length; i++){
            this.alts.push(accounts.find(acc => acc.name.toLowerCase() == altnames[i].toLowerCase()))
        }
    }

    async updateWins() {
        let newWins = 0;
        for(let i = 0; i<this.alts.length; i++) {
            newWins += await this.alts[i].wins;
        }
        this.wins = newWins;
        return newWins;
    }
}