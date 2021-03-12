var playername = undefined;

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
        "HITW: " + data.hitwQual + "q " + data.hitwFinal + "f"
    );
    setHtmlByName("xp", "XP: " + data.xp);
    setHtmlByName("karma", "Karma: " + data.karma);
    setHtmlByName("name", "Name: " + data.name);
    setHtmlByName("uuid", "UUID: " + data.uuid);
    setHtmlByName(
        "rank",
        "Rank: " + data.rank.replace(/_/g, "").replace(/PLUS/g, "+")
    );
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
                }
            });
        });
    }
}
