const { getAccountData } = require("./hypixelApi");
const optifineRequest = require("./optifineRequest");
const labyRequest = require("./labyRequest");

module.exports = class Account {
    name = "";
    wins = 0;
    uuid = "";
    uuidPosix = {};
    internalId = "";
    rank = "";
    version = "";
    mostRecentGameType = "";
    xp = 0;
    hitwQual = 0;
    hitwFinal = 0;
    farmhuntWins = 0;
    ranksGifted = 0;
    hasOFCape = false;
    hasLabyCape = false;
    discord = "";
    karma = 0;
    isLoggedIn = false;

    constructor(name, wins, uuid) {
        this.name = name;
        this.wins = wins;
        this.uuid = uuid;
        let timeLow = uuid.slice(0, 8);
        let timeMid = uuid.slice(8, 12);
        let version = uuid.slice(12, 16);
        let varient = uuid.slice(16, 20);
        let node = uuid.slice(-12);
        this.uuidPosix = `${timeLow}-${timeMid}-${version}-${varient}-${node}`;
    }

    async updateData() {
        await Promise.all([
            this.updateHypixel(),
            this.updateOptifine(),
            this.updateLaby(),
        ]);
    }

    async updateOptifine() {
        let req = new optifineRequest(this.name);
        await req.makeRequest();
        this.hasOFCape = req.hasCape();
    }

    async updateLaby() {
        let req = new labyRequest(this.uuidPosix);
        await req.makeRequest();
        this.hasLabyCape = req.hasCape();
    }

    async updateHypixel() {
        let json = await getAccountData(this.uuid);
        // make sure player has stats to be checked
        if (json.player && json.player.stats && json.player.stats.Arcade) {
            let arcade = json.player.stats.Arcade;

            let wins = 0;
            if (arcade.wins_party) wins += arcade.wins_party;
            if (arcade.wins_party_2) wins += arcade.wins_party_2;
            if (arcade.wins_party_3) wins += arcade.wins_party_3;
            this.wins = wins;

            this.rank = json.player.newPackageRank;
            if (json.player.monthlyPackageRank == "SUPERSTAR")
                this.rank += "_PLUS";
            if (json.player.rank) this.rank = json.player.rank;

            if (
                json.player.socialMedia &&
                json.player.socialMedia.links &&
                json.player.socialMedia.links.DISCORD
            )
                this.discord = json.player.socialMedia.links.DISCORD;

            this.name = json.player.displayname;

            this.internalId = json.player._id;

            this.isLoggedIn = json.player.lastLogin > json.player.lastLogout;

            this.version = json.player.mcVersionRp;

            this.mostRecentGameType = json.player.mostRecentGameType;

            this.xp = json.player.networkExp;

            this.karma = json.player.karma;

            this.ranksGifted =
                json.player.giftingMeta != undefined
                    ? json.player.giftingMeta.ranksGiven
                    : 0;

            this.hitwFinal = arcade.hitw_record_f;
            this.hitwQual = arcade.hitw_record_q;

            this.farmhuntWins = arcade.wins_farm_hunt;
        }
    }
};
