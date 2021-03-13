var playername = undefined;
let urlParams = undefined;

function setName(name) {
    playername = name;
    refresh();
}

function setHtmlByName(name, html) {
    document.getElementById(name).innerHTML = html.replace(/undefined/g, "0");
}

function refresh() {
    loadData();
}

function displayData(data) {
    console.log(data);
    // setHtmlByName('title', 'Player data for ' + playername);
    setHtmlByName("pg-wins", "Party games wins: " + data.wins);
    setHtmlByName("fh-wins", "Farm hunt wins: " + data.farmhuntWins);
    setHtmlByName(
        "hitw",
        "HITW: " + data.hitwQual + "Q " + data.hitwFinal + "F"
    );
    setHtmlByName("xp", "XP: " + data.xp);
    setHtmlByName("karma", "Karma: " + data.karma);
    setHtmlByName("name", "Name: " + data.name);
    setHtmlByName("uuid", "UUID: " + data.uuid);
    if (data.rank) {
        setHtmlByName(
            "rank",
            "Rank: " + data.rank.replace(/_/g, "").replace(/PLUS/g, "+")
        );
    } else {
        setHtmlByName("rank", "Rank: Non");
    }
    setHtmlByName("version", "Version: " + data.version);
    setHtmlByName("loggedIn", "Online: " + data.isLoggedIn);
    document
        .getElementById("render")
        .setAttribute(
            "src",
            "https://crafatar.com/renders/body/" +
                data.uuid +
                "?size=512&default=MHF_Steve&scale=10&overlay"
        );
    document
        .getElementById("lvlimg")
        .setAttribute(
            "src",
            "https://gen.plancke.io/exp/" + data.uuid + ".png"
        );
    document
        .getElementById("achivimg")
        .setAttribute(
            "src",
            "https://gen.plancke.io/achievementPoints/" + data.uuid + ".png"
        );
}

function loadData() {
    if (playername != undefined) {
        fetch("http://eatmyvenom.me/share/accounts.json").then((res) => {
            res.text().then((rawjson) => {
                let json = JSON.parse(rawjson);
                let playerdata = json.find(
                    (acc) => acc.name.toLowerCase() == playername.toLowerCase()
                );
                if (playerdata != undefined) {
                    displayData(playerdata);
                    if (
                        urlParams.get("q").toLowerCase() !=
                        playername.toLowerCase()
                    ) {
                        urlParams.set("q", playername);
                        window.location.search = urlParams;
                    }
                }
            });
        });
    }
}

function loadPage() {
    let queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    playername = urlParams.get("q");

    refresh();
    document.getElementById("ign").value = urlParams.get("q");
}

window.addEventListener("load", loadPage);
