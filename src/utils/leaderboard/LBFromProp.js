const utils = require("../../utils");
const { getList } = require("./ListUtils");

module.exports = async function listDiffByProp(name, prop, timetype, maxamnt, category, fileCache) {
    let newlist, oldlist;
    if(fileCache != undefined) {
        newlist = JSON.parse(JSON.stringify(fileCache[`${name}`]));
        oldlist = JSON.parse(JSON.stringify(fileCache[`${timetype}${name}`]));
    } else {
        if (name == "accounts") {
            newlist = await getList();
            oldlist = await getList(timetype);
        } else {
            newlist = await utils.readJSON(`${name}.json`);
            oldlist = await utils.readJSON(`${name}.${timetype}.json`);
        }
    }

    let acc;
    for (let i = 0; i < oldlist.length; i++) {
        acc = newlist.find((g) => g?.uuid == oldlist[i]?.uuid);
        // make sure acc isnt null/undefined
        if(acc == undefined || acc == null) {
            continue;
        }

        if (category == undefined) {
            oldlist[i][prop] = (acc[prop] ?? 0) - (oldlist[i][prop] ?? 0);
        } else {
            if(oldlist[i][category] != undefined) {
                oldlist[i][category][prop] = (acc?.[category]?.[prop] ?? 0) - (oldlist[i]?.[category]?.[prop] ?? 0);
            } else {
                oldlist[i][category] = {};
                oldlist[i][category][prop] = (acc?.[category]?.[prop] ?? 0) - (oldlist[i]?.[category]?.[prop] ?? 0);
            }
        }
    }

    return oldlist.slice(0, maxamnt);
};
