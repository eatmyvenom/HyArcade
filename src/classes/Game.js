class Game {
    type = "";
    start = 0;
    end = 0;
    /**
     * Creates an instance of Game.
     *
     * @param {object} json
     * @memberof Game
     */
    constructor (json) {
        this.type = `${json.gameType}.${json.mode}`;
        this.start = json.date;
        this.end = json.ended;
    }
}

module.exports = Game;
