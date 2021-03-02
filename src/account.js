const { getAccountData } = require('./hypixelApi');

module.exports = class Account {
    name="";
    wins=0;
    uuid="";
    rank="";
    version="";
    mostRecentGameType="";
    xp=0;
    hitwQual=0;
    hitwFinal=0;
    farmhuntWins=0;
    ranksGifted=0;

    constructor(name,wins,uuid){
        this.name = name;
        this.wins = wins;
        this.uuid = uuid;
    }

    async updateData() {
        let json = await getAccountData(this.uuid);
        // make sure player has stats to be checked
        if(json.player && json.player.stats && json.player.stats.Arcade) {
            let arcade = json.player.stats.Arcade;

            let wins = 0;
            if(arcade.wins_party)   wins += arcade.wins_party;
            if(arcade.wins_party_2) wins += arcade.wins_party_2;
            if(arcade.wins_party_3) wins += arcade.wins_party_3;
            this.wins = wins;

            this.rank = json.player.newPackageRank;
            if(json.player.monthlyPackageRank == 'SUPERSTAR') this.rank += "_PLUS";
            if(json.player.rank) this.rank = json.player.rank;
            
            this.name = json.player.displayname;

            this.version = json.player.mcVersionRp;

            this.mostRecentGameType = json.player.mostRecentGameType;

            this.xp = json.player.networkExp;

            this.ranksGifted = (json.player.giftingMeta != undefined) ? json.player.giftingMeta.ranksGiven : 0 ;

            this.hitwFinal = arcade.hitw_record_f;
            this.hitwQual = arcade.hitw_record_q;

            this.farmhuntWins = arcade.wins_farm_hunt;
        }
    }
}