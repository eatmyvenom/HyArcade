exports.sleep = function sleep(time) {
    return new Promise((resolve) =>{
        setTimeout(resolve,time);
    });
}

exports.winsSorter = function winsSorter(a,b) {
    if(a.wins < b.wins) return 1;
    if(a.wins > b.wins) return -1;
    return 0;
}