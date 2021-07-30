const utils = require("../../utils");
const { getList } = require("./ListUtils");

function numberify(str) {
    str = str ?? 0;
    return Number(str);
}

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

    for (let i = 0; i < oldlist.length; i++) {
        let acc = newlist.find((g) => ("" + g.uuid).toLowerCase() == ("" + oldlist[i].uuid).toLowerCase());
        // make sure acc isnt null/undefined
        if(acc == undefined || acc == null) {
            continue;
        }

        if (category == undefined) {
            oldlist[i][prop] = numberify(acc[prop]) - numberify(oldlist[i][prop]);
        } else {
            if(oldlist[i][category] != undefined) {
                oldlist[i][category][prop] = numberify(acc?.[category]?.[prop]) - numberify(oldlist[i]?.[category]?.[prop]);
            } else {
                oldlist[i][category] = {};
                oldlist[i][category][prop] = numberify(acc?.[category]?.[prop]) - numberify(oldlist[i]?.[category]?.[prop]);
            }
        }
    }

    return oldlist.slice(0, maxamnt);
};
