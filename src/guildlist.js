/* These guild lists are not accurate
 * this is due to the fact that if I add
 * every guild member it will take way 
 * too much time to regenerate the list 
 * every time. If anyone wants to have 
 * someone added please let me know.
 */
module.exports = function gld(accs) {
    let accounts = accs;
    let Guild = require("./guild")(accounts);
    return [
        new Guild("mini",           "5fd934088ea8c9855c1256c1"), // mini
        new Guild("Fidelity",       "5ffe240e8ea8c9e004b017e7"), // Fidelity
        new Guild("TKJK",           "57c72db00cf24b341f8d955f"), // TKJK
        new Guild("Cactus",         "5fc573a68ea8c9d1008d616d"), // Cactus
        new Guild("sadvibes",       "5f9b78518ea8c992ddb8cb4b"), // sadvibes
        new Guild("psoldiers",      "5dfdbd7d8ea8c92086b1065b"), // psoldiers
        new Guild("PartyGamers",    "5d91564977ce8436b66ad2bf"), // PartyGamers
	new Guild("Nope",           "52e68cf30cf254781aced9cc"), // Nope
	new Guild("HypeW",          "557735380cf2d285c639eddd"), // hypew
    ];
}
