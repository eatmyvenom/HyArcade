var maxLength = 100;

function addstuff(ext, clazzz) {
    fetch("http://eatmyvenom.me/share/" + ext).then((res) => {
        res.text().then((txt) => {
            var arr = txt.split("\n");
            var len = Math.min(arr.length, maxLength);
            var newArr = arr.slice(0, len);
            console.log(ext);
            if (("" + ext).includes("pgA") || ext.includes("status")) {
                for (var i = 0; i < newArr.length; i++) {
                    if (newArr[i].trim() != "") {
                        let line = newArr[i].split(":");
                        newArr[
                            i
                        ] = `<a href='http://eatmyvenom.me/share/partygames/player.html?q=${line[0]
                            .replace(/[0-9][0-9][0-9]\)/g, "")
                            .trim()}'>${line[0]}</a>:${line[1]}`;
                    }
                }
            }
            document.querySelector(clazzz).innerHTML = newArr.join("\n").trim();
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

function toggleBtn(sel) {
    var e = document.querySelector(sel);
    if (e.hasAttribute("off")) {
        e.removeAttribute("off");
    } else {
        e.setAttribute("off", "");
    }
}

function toggleCombined() {
    toggleDisplay(".lbh");
    toggleDisplay(".lb");
    toggleDisplay(".dayh");
    toggleDisplay(".daily");
    toggleBtn(".lbb");
}

function toggleGuilds() {
    toggleDisplay(".gldh");
    toggleDisplay(".guild");
    toggleDisplay(".glddh");
    toggleDisplay(".guildday");
    toggleBtn(".gldb");
}

function toggleNormal() {
    toggleDisplay(".acch");
    toggleDisplay(".accounts");
    toggleDisplay(".accdh");
    toggleDisplay(".accountsday");
    toggleBtn(".accb");
}

function maxValChange(value) {
    maxLength = value;
}

main();
setInterval(main, "5000");
