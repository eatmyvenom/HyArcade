const hypixelRequest = require('./hypixelRequest');
let accounts = []; // type coercing 

module.exports = function Gld(acclist) {
    accounts=acclist
    return Guild;
}

class Guild {
    members = [];
    name = "";
    wins = 0;
    uuid = '';

    constructor(name ,uuid) {
        this.uuid = uuid;
        this.name = name;
    }

    /**
     * This isnt in the constructor because then every usage
     * of anything in the entire site will result in a few
     * needless api requests
     */
    async updateData() {
        let data = await this.getGuild();
        this.name = data.guild.name_lower;

        let gmembers = data.guild.members; 
        for(let i = 0; i < gmembers.length; i++) {
            // find a corrosponding account in my account list
            let gamer = accounts.find( acc => acc.uuid == gmembers[i].uuid);
            // dont add empty accounts
            if (gamer != undefined) {
                this.members.push(gamer);
            }
        }
    }

    async getGuild() {
        return JSON.parse(await hypixelRequest.getGuildRaw(this.uuid));
    }

    async updateWins() {
        await this.updateData();
        let newWins = 0;
        for(let i = 0; i < this.members.length; i++) {
            let memberwins = await this.members[i].wins;
            newWins += memberwins;
        }
        this.wins = newWins;
        return newWins;
    }
}