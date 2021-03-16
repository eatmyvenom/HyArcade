const Game = require("./classes/Game");
const hypixelApi = require("./hypixelApi");
const { writeJSON, readJSON } = require("./utils");

class gamesPlayed {
    uuid = "";
    counts = {};
    newestTime = 0;

    constructor(uuid, oldCounts, newestTime) {
        this.uuid = uuid;
        this.counts = oldCounts;
        this.newestTime = newestTime;
    }

    async updateData() {
        let json = JSON.parse(await hypixelApi.getGamesPlayedRAW(this.uuid));
        let newGames = json.games.reverse();

        for (let g of newGames) {
            let game = new Game(g);
            if (game.start > this.newestTime) {
                this.addCount(game.type);
                this.newestTime = game.start;
            }
        }
    }

    addCount(type) {
        if (this.counts[type] != undefined) {
            this.counts[type]++;
        } else {
            this.counts[type] = 1;
        }
    }

    async writeToFile() {
        let full = await readJSON("./gamesPlayed.json");
        full[this.uuid] = this;
        await writeJSON("./gamesPlayed.json", full);
    }
}

module.exports = gamesPlayed;
