async function txtPlayerList(list,maxamnt = -1){
    let str="";
    let len = (maxamnt != -1) ? maxamnt : list.length;
    for(let i = 0;i < len; i++){
        // don't print if player has 0 wins
        if(list[i].wins < 1 || config.printAllWins) continue;
        
        // this hack is because js has no real string formatting and its
        // not worth it to use wasm or nodenative for this
        let num = (
            "000"
            +(i+1)
        )
        .slice(-3);
        
        let name = (
            list[i].name
            	.slice(0,1)
            	.toUpperCase()
            + list[i].name
            	.slice(1)
            + "                       "
        ).slice(0,17);
        str+=`${num}) ${name}: ${list[i].wins}\n`;
    }
    return str;
}

async function listNormal(name, maxamnt) {
    let list = JSON.parse(fs.readFileSync(`${name}.json`));
    list.sort(winsSorter);
    list = list.slice(0,maxamnt);
    return list;
}

async function listDiff(name, timetype, maxamnt) {
    let newlist = JSON.parse(fs.readFileSync(`${name}.json`));
    let oldlist = JSON.parse(fs.readFileSync(`${name}.${timetype}.json`));

    // sort the list before hand
    oldlist = oldlist.sort(winsSorter);

    for(let i=0;i<oldlist.length;i++) {
        acc = newlist.find(g=>g.name.toLowerCase()==oldlist[i].name.toLowerCase())
        // make sure acc isnt null/undefined
        if (acc) {
            oldlist[i].wins = acc.wins - oldlist[i].wins;
        }
    }

    // use old list to ensure that players added today 
    // don't show up with a crazy amount of daily wins
    oldlist = oldlist.sort(winsSorter);
    return oldlist.slice(0,maxamnt);
}

async function stringNormal(name,maxamnt) {
    let list = await listNormal(name,maxamnt);
    return await txtPlayerList(list);
}

async function stringDiff(name,timetype, maxamnt) {
    let list = await listDiff(name,timetype);
    return await txtPlayerList(list);
}

async function stringDaily(name,maxamnt) {
    return await stringDiff(name,'day',maxamnt);
}

module.exports = {
    txtPlayerList : txtPlayerList,
    listNormal : listNormal,
    listDiff : listDiff,
    stringNormal : stringNormal,
    stringDiff : stringDiff,
    stringDaily : stringDaily
}