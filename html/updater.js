function addstuff(ext, clazzz) {
    fetch("http://eatmyvenom.me/share/" + ext).then((res) => {
        res.text().then((txt) => {
            document.querySelector(clazzz).innerHTML = txt.trim();
        });
    });
}

function main() {
    addstuff("pgd.txt", ".daily");
    addstuff("pg.txt", ".lb");
    addstuff("pgstatus.txt", ".status");
    addstuff("pgG.txt", ".guild");
    addstuff("pgGd.txt", ".guildday");
    addstuff("pgA.txt", ".accounts");
    addstuff("pgAd.txt", ".accountsday");
    addstuff("hynums.txt", ".counts");
}

function toggleDisplay(sel) {
    var e = document.querySelector(sel);
    if (e.style.display === "none") {
        e.style.display = "inline-block";
    } else {
        e.style.display = "none";
    }
}

function toggleCombined() {
    toggleDisplay(".lbh");
    toggleDisplay(".lb");
    toggleDisplay(".dayh");
    toggleDisplay(".daily");
}

function toggleGuilds() {
    toggleDisplay(".gldh");
    toggleDisplay(".guild");
    toggleDisplay(".glddh");
    toggleDisplay(".guildday");
}

function toggleNormal() {
    toggleDisplay(".acch");
    toggleDisplay(".accounts");
    toggleDisplay(".accdh");
    toggleDisplay(".accountsday");
}

main();
setInterval(main, "5000");