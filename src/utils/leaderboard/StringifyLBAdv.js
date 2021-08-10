const {
    getList
} = require("./ListUtils");
const TimSort = require("timsort");

/**
 * @param {number} number
 * @returns {string} formatted number
 */
function formatNum (number) {
    return Intl.NumberFormat("en").format(number);
}

module.exports = async function stringLBAdv (comparitor, parser, maxamnt, listTransformer, startingIndex = 0) {
    let list = await getList();
    list = await listTransformer(list);
    TimSort.sort(list, comparitor);

    let str = "";
    list = list.slice(startingIndex, maxamnt);
    for(let i = 0; i < list.length; i++) {
        let propVal = parser(list[i]);

        let {name} = list[i];
        str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
    }
    return str.replace(/\\?_/g, "\\_");
};
