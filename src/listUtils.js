const fs = require("fs/promises");
const utils = require("./utils");
const config = require("../config.json");

async function txtPlayerList(list, maxamnt) {
    let str = "";
    let len = maxamnt != undefined ? maxamnt : list.length;
    for (let i = 0; i < len; i++) {
        // don't print if player has 0 wins
        if (list[i].wins < 1 && !config.printAllWins) continue;

        // this hack is because js has no real string formatting and its
        // not worth it to use wasm or node native for this
        let num = ("000" + (i + 1)).slice(-3);

        let name = (
            list[i].name.slice(0, 1).toUpperCase() +
            list[i].name.slice(1) +
            "                       "
        ).slice(0, 17);
        //         001) Monkey           : 5900
        str += `${num}) ${name}: ${list[i].wins}\n`;
    }
    return str;
}

async function listNormal(name, maxamnt) {
    let thelist = JSON.parse(await fs.readFile(`${name}.json`));
    thelist.sort(utils.winsSorter);
    thelist = thelist.slice(0, maxamnt);
    return thelist;
}

async function listDiff(name, timetype, maxamnt) {
    // cant use require here
    let newlist = JSON.parse(await fs.readFile(`${name}.json`));
    let oldlist = JSON.parse(await fs.readFile(`${name}.${timetype}.json`));

    // sort the list before hand
    oldlist = oldlist.sort(utils.winsSorter);

    for (let i = 0; i < oldlist.length; i++) {
        let acc;
        if (oldlist[i].uuid) {
            acc = newlist.find(
                (g) => g.uuid.toLowerCase() == oldlist[i].uuid.toLowerCase()
            );
        } else {
            acc = newlist.find(
                (g) => g.name.toLowerCase() == oldlist[i].name.toLowerCase()
            );
        }
        // make sure acc isnt null/undefined
        if (acc) {
            oldlist[i].wins = acc.wins - oldlist[i].wins;
        }
    }

    // use old list to ensure that players added today
    // don't show up with a crazy amount of daily wins
    oldlist = oldlist.sort(utils.winsSorter);
    return oldlist.slice(0, maxamnt);
}

async function stringNormal(name, maxamnt) {
    let list = await listNormal(name, maxamnt);
    return await txtPlayerList(list);
}

async function stringDiff(name, timetype, maxamnt) {
    let list = await listDiff(name, timetype, maxamnt);
    return await txtPlayerList(list, maxamnt);
}

async function stringDaily(name, maxamnt) {
    return await stringDiff(name, "day", maxamnt);
}

module.exports = {
    txtPlayerList: txtPlayerList,
    listNormal: listNormal,
    listDiff: listDiff,
    stringNormal: stringNormal,
    stringDiff: stringDiff,
    stringDaily: stringDaily,
};
