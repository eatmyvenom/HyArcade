const { getList } = require("./ListUtils");

module.exports = async function stringLBAdv(comparitor, maxamnt, listTransformer) {
    let list = await getList();
    list = await listTransformer(list);
    list = list.sort(comparitor);
    list = list.slice(0, maxamnt);
    return list;
};
