var playername = undefined;
let urlParams = undefined;
let uuid = undefined;

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

function home() {
    window.location.href = "http://eatmyvenom.me/share/partygames/";
}

function formatTime(time) {
    return new Date(time).toLocaleString();
}

function formatNum(number) {
    let str = new Number(number);
    if (number == undefined) {
        return new Number(0).toLocaleString();
    } else {
        return str.toLocaleString();
    }
}

function setIcon(uuid) {
    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    link.href = "https://crafatar.com/avatars/" + uuid + "?overlay";
}

function displayData(data) {
    console.log(data);
    let ver = data.version ? data.version : "1.8.9";
    setHtmlByName("pg-wins", "Party games wins: " + formatNum(data.wins));
    setHtmlByName("fh-wins", "Farm hunt wins: " + formatNum(data.farmhuntWins));
    setHtmlByName(
        "hysay",
        "Hypixel says wins: " + formatNum(data.hypixelSaysWins)
    );
    setHtmlByName(
        "hitw",
        "HITW: " + data.hitwQual + "Q " + data.hitwFinal + "F"
    );
    setHtmlByName("xp", "XP: " + formatNum(data.xp));
    setHtmlByName("karma", "Karma: " + formatNum(data.karma));
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
    setHtmlByName("version", "Version: " + ver);
    setHtmlByName("loggedIn", "Online: " + data.isLoggedIn);
    setHtmlByName("firstLogin", "First login: " + formatTime(data.firstLogin));
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

    setIcon(data.uuid);
}

function handleData(rawjson) {
    let json = JSON.parse(rawjson);
    let playerdata = json.find(
        (acc) =>
            acc.name.toLowerCase() == playername.toLowerCase() ||
            acc.uuid == playername.toLowerCase()
    );
    if (playerdata != undefined) {
        displayData(playerdata);
        uuid = playerdata.uuid;
        loadGamesPlayed();
        if (urlParams.has("q")) {
            if (urlParams.get("q").toLowerCase() != playername.toLowerCase()) {
                urlParams.set("q", playername);
                window.history.replaceState(
                    window.history.state,
                    "",
                    window.location.pathname + "?" + urlParams.toString()
                );
            }
        } else {
            urlParams.append("q", playername);
            window.history.replaceState(
                window.history.state,
                "",
                window.location.pathname + "?" + urlParams.toString()
            );
        }
    }
}

function handleGamesPlayed(rawjson) {
    let json = JSON.parse(rawjson);
    let data = json[uuid];
    let sortable = Object.entries(data.counts)
        .sort(([, a], [, b]) => a - b)
        .reverse()
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    let countsStr = "";
    for (let count in sortable) {
        countsStr += `${count.replace(/\./g, " ").replace(/_/g, " ")}: ${
            sortable[count]
        }\n`;
    }

    setHtmlByName("gamesPlayed", countsStr);
}

function loadData() {
    if (playername != undefined) {
        fetch("http://eatmyvenom.me/share/accounts.json").then((res) => {
            res.text().then(handleData);
        });
    }
}

function loadGamesPlayed() {
    fetch("http://eatmyvenom.me/share/gamesPlayed.json").then((res) => {
        res.text().then(handleGamesPlayed);
    });
}

function loadPage() {
    let queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    playername = urlParams.get("q");

    refresh();
    document.getElementById("ign").value = urlParams.get("q");
}

window.addEventListener("load", loadPage);
