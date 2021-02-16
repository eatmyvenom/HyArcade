function sleep(time) {
    return new Promise((resolve) =>{
        setTimeout(resolve,time);
    });
}

function winsSorter(a,b) {
    if(a.wins < b.wins) return 1;
    if(a.wins > b.wins) return -1;
    return 0;
}

module.exports = { sleep : sleep, winsSorter : winsSorter };