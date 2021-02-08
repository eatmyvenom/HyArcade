let accounts;

module.exports = function Gld(acclist) {
    accounts=acclist
    return Guild;
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