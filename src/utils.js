const config = require('../config.json');
/**
 * This only works in async functions
 * because of how promises work.
 */
function sleep(time) {
    return new Promise((resolve) =>{
        setTimeout(resolve,time);
    });
}

/**
 * This literally just sorts from
 * an object in the element
 */
function winsSorter(a,b) {
    if (config.sortDirection ==  'mostleast') {
        if(a.wins < b.wins) return 1;
        if(a.wins > b.wins) return -1;
        return 0;
    } else {
        if(a.wins > b.wins) return 1;
        if(a.wins < b.wins) return -1;
        return 0;
    }
}

function daytime() {
    return config.showDaytime ? 
    Date()
        .replace(/.*20[0-9][0-9] /,'')
        .replace(/ [A-Z]..-[0-9]... \(.*\)/,'') 
        + " " :
    "";
}

function day() {
    return Date().replace(/[0-9].:[0-9].:[0-9].*/,'').trim().replace(/ /g,'_');
}

async function archiveJson(oldfile, path, timetype) {
    old = JSON.parse(fs.readFileSync(oldfile+".json"));
    fs.writeFileSync(`${path}${oldfile}.${timetype}.json`, JSON.stringify(old,null,4));
}


module.exports = { archiveJson : archiveJson, day : day, sleep : sleep, winsSorter : winsSorter, daytime: daytime, cacheMiss : [] };