/** @type {Account[]} */
let accounts = [];

module.exports = function Plr(acclist) {
    accounts = acclist;
    return Player;
};

class Player {
    name = "";
    altnames = [];
    alts = [];
    wins = 0;

    /**
     * Creates an instance of Player.
     * @param {String} name The displayed name of the player
     * @param {String} altnames The uuids or names of the players accounts
     * @param {Number} wins The preset amount of wins
     * @memberof Player
     */
    constructor(name, altnames, wins) {
        this.name = name;
        this.altnames = altnames;
        this.wins = wins;

        for (let i = 0; i < altnames.length; i++) {
            // if uuid then check uuid
            if (altnames[i].length == 32) {
                this.alts.push(
                    accounts.find(
                        (acc) =>
                            acc.uuid.toLowerCase() == altnames[i].toLowerCase()
                    )
                );
            } else {
                this.alts.push(
                    accounts.find(
                        (acc) =>
                            acc.name.toLowerCase() == altnames[i].toLowerCase()
                    )
                );
            }
        }
    }

    /**
     * Set the players wins to be combined amount of wins from all of the players accounts
     *
     * @return {Number}
     * @memberof Player
     */
    async updateWins() {
        let newWins = 0;
        for (let i = 0; i < this.alts.length; i++) {
            if (this.alts[i] == undefined) {
                continue;
            }
            newWins += await this.alts[i].wins;
        }
        this.wins = newWins;
        return newWins;
    }
}
