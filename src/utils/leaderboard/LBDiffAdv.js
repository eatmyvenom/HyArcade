const MakeLeaderboardAdv = require("./MakeLeaderboardAdv");
const TimSort = require("timsort");

module.exports = async function LBDiffAdv(comparitor, maxamnt, timetype, callback, listTransformer) {
    let list = await MakeLeaderboardAdv("accounts", timetype, 9999, callback);
    list = await listTransformer(list);
    TimSort.sort(list, comparitor);
    list = list.slice(0, maxamnt);
    return list;
};