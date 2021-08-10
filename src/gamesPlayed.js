const Game = require("./classes/Game");
const hypixelApi = require("./hypixelApi");
const {
    writeJSON,
    readJSON
} = require("./utils");

class gamesPlayed {
    uuid = "";
    counts = {};
    newestTime = 0;

    constructor (uuid, oldCounts, newestTime) {
        this.uuid = uuid;
        this.counts = oldCounts;
        this.newestTime = newestTime;
    }

    async updateData () {
        const json = JSON.parse(await hypixelApi.getGamesPlayedRAW(this.uuid));
        const newGames = json.games.reverse();

        for(const g of newGames) {
            const game = new Game(g);
            if(game.start > this.newestTime) {
                this.addCount(game.type);
                this.newestTime = game.start;
            }
        }
    }

    addCount (type) {
        if(this.counts[type] != undefined) {
            this.counts[type]++;
        } else {
            this.counts[type] = 1;
        }
    }

    async writeToFile () {
        const full = await readJSON("./gamesPlayed.json");
        full[this.uuid] = this;
        await writeJSON("./gamesPlayed.json", full);
    }
}

module.exports = gamesPlayed;
