const {
    stringifyList,
    getList
} = require("./ListUtils");
const TimSort = require("timsort");

/**
 * @param {string} str
 * @returns {number} The number primitive
 */
function numberify (str) {
    return Number(str);
}

module.exports = async function stringLB (lbprop, maxamnt, category, startingIndex = 0) {
    let list = await getList();
    if(category == undefined) {
        TimSort.sort(list, (b, a) => {
            return numberify(a?.[lbprop] ?? 0) - numberify(b?.[lbprop] ?? 0);
        });
    } else {
        TimSort.sort(list, (b, a) => {
            return numberify(a?.[category]?.[lbprop] ?? 0) - numberify(b?.[category]?.[lbprop] ?? 0);
        });
    }

    return stringifyList(list, lbprop, category, maxamnt, startingIndex);
};
