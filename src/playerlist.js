/**
 * Wrapper around the list parser players function
 *
 * @param {*} accs
 * @return {Player[]} 
 */
module.exports = function plrs(accs) {
    return require("./listParser").players(accs);
};
