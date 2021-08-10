const {
    getList
} = require("./ListUtils");
const TimSort = require("timsort");

module.exports = async function stringLBAdv (comparitor, maxamnt, listTransformer) {
    let list = await getList();
    list = await listTransformer(list);
    TimSort.sort(list, comparitor);
    list = list.slice(0, maxamnt);
    return list;
};
