const utils = require("../../utils");
const { getList } = require("./ListUtils");

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
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

    // sort the list before hand
    oldlist = oldlist.sort(utils.winsSorter);

    for (let i = 0; i < oldlist.length; i++) {
        let acc;
        if (oldlist[i].uuid) {
            acc = newlist.find((g) => ("" + g.uuid).toLowerCase() == ("" + oldlist[i].uuid).toLowerCase());
        } else {
            acc = newlist.find((g) => ("" + g.name).toLowerCase() == ("" + oldlist[i].name).toLowerCase());
        }

        if (category == undefined) {
            // make sure acc isnt null/undefined
            if (acc) {
                oldlist[i][prop] = numberify(acc[prop]) - numberify(oldlist[i][prop]);
            }
        } else {
            // make sure acc isnt null/undefined
            if (acc) {
                oldlist[i][category][prop] = numberify(acc[category][prop]) - numberify(oldlist[i][category][prop]);
            }
        }
    }

    // use old list to ensure that players added today
    // don't show up with a crazy amount of daily wins
    oldlist = oldlist.sort(utils.winsSorter);
    return oldlist.slice(0, maxamnt);
};
