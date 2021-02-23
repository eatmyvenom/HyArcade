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

module.exports = { sleep : sleep, winsSorter : winsSorter };