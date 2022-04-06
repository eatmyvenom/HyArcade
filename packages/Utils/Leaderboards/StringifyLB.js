const TimSort = require("timsort");
const { stringifyList, getList } = require("./ListUtils");

module.exports = async function stringLB(lbprop, maxamnt, category, startingIndex = 0) {
  const list = await getList();
  if (category == undefined) {
    TimSort.sort(list, (b, a) => Number(a?.[lbprop] ?? 0) - Number(b?.[lbprop] ?? 0));
  } else {
    TimSort.sort(list, (b, a) => Number(a?.[category]?.[lbprop] ?? 0) - Number(b?.[category]?.[lbprop] ?? 0));
  }

  return stringifyList(list, lbprop, category, maxamnt, startingIndex);
};
