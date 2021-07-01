const MakeLeaderboardAdv = require("./MakeLeaderboardAdv");

module.exports = async function LBDiffAdv(comparitor, maxamnt, timetype, callback, listTransformer) {
    let list = await MakeLeaderboardAdv("accounts", timetype, 9999, callback);
    list = await listTransformer(list);
    list = list.sort(comparitor);
    list = list.slice(0, maxamnt);
    return list;
};