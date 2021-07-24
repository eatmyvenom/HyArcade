const { stringifyList, getList } = require("./ListUtils");

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}

module.exports = async function stringLB(lbprop, maxamnt, category, startingIndex = 0) {
    let list = await getList();
    if (category == undefined) {
        list = await [].concat(list).sort((b, a) => {
            return numberify(a[lbprop]) - numberify(b[lbprop]);
        });
    } else {
        list = await [].concat(list).sort((b, a) => {
            return numberify(a[category]?.[lbprop]) - numberify(b[category]?.[lbprop]);
        });
    }

    return stringifyList(list, lbprop, category, maxamnt, startingIndex);
};
