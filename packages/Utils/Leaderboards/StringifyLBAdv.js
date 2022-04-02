const TimSort = require("timsort");
const { getList } = require("@hyarcade/utils/Leaderboards/ListUtils");

/**
 * @param {number} number
 * @returns {string} formatted number
 */
function formatNum(number) {
  return Intl.NumberFormat("en").format(number);
}

module.exports = async function stringLBAdv(comparitor, parser, maxamnt, listTransformer, startingIndex = 0) {
  let list = await getList();
  list = await listTransformer(list);
  TimSort.sort(list, comparitor);

  let str = "";
  list = list.slice(startingIndex, maxamnt);
  for (const [i, listItem] of list.entries()) {
    const propVal = parser(listItem);

    const { name } = listItem;
    str += `${i + 1}) **${name}** (${formatNum(propVal)})\n`;
  }
  return str.replace(/\\?_/g, "\\_");
};
