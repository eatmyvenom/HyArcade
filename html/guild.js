let maxLength = 25;

/**
 *
 */
async function load() {
    let game = window.location.pathname.slice(0, -5);
    game = game.substring(game.lastIndexOf("/") + 1);
    let main = document.querySelector("main");
    let mainTitle = document.querySelector("h1");
    let address = document.querySelector("address");

    let lifetime = document.createElement("div");
    let daily = document.createElement("div");
    lifetime.setAttribute("class", "life");
    daily.setAttribute("class", "day");

    main.appendChild(lifetime);
    main.appendChild(daily);

    switch(game) {
    case "pg": {
        mainTitle.innerHTML = "Party games";
        address.innerHTML = "<a href=\"https://discord.gg/kVSdPevCwm\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "wins";
        daily.title = "Daily wins";
        daily.id = "wins";
        break;
    }

    case "hs": {
        mainTitle.innerHTML = "Hypixel Says";
        address.innerHTML = "<a href=\"https://discord.gg/GzjN5c4zze\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "hypixelSaysWins";
        daily.title = "Daily wins";
        daily.id = "hypixelSaysWins";
        break;
    }

    case "fh": {
        mainTitle.innerHTML = "Farm hunt";
        address.innerHTML = "<a href=\"https://discord.gg/fVgcvhtaWk\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "farmhuntWins";
        daily.title = "Daily wins";
        daily.id = "farmhuntWins";
        break;
    }

    case "hitw": {
        mainTitle.innerHTML = "Hole in the wall";
        address.innerHTML = "<a href=\"https://discord.gg/Gh24vw5b54\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "hitwWins";
        daily.title = "Daily wins";
        daily.id = "hitwWins";
        break;
    }

    case "fb": {
        mainTitle.innerHTML = "Football";
        address.innerHTML = "<a href=\"https://discord.gg/P5c5RSG2yF\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        daily.title = "Daily wins";

        lifetime.id = "footballWins";
        daily.id = "footballWins";
        break;
    }

    case "es": {
        mainTitle.innerHTML = "Ender spleef";
        address.innerHTML = "<a href=\"https://discord.gg/9xRhumdEyq\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "enderSpleefWins";
        daily.title = "Daily wins";
        daily.id = "enderSpleefWins";
        break;
    }

    case "to": {
        mainTitle.innerHTML = "Throw out";
        address.innerHTML = "<a href=\"https://discord.gg/2sMpvqtJYh\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "throwOutWins";
        daily.title = "Daily wins";
        daily.id = "throwOutWins";
        break;
    }

    case "gw": {
        mainTitle.innerHTML = "Galaxy Wars";
        address.innerHTML = "<a href=\"https://discord.gg/v9ZwqyZfYj\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "galaxyWarsWins";
        daily.title = "Daily wins";
        daily.id = "galaxyWarsWins";
        break;
    }

    case "dw": {
        mainTitle.innerHTML = "Dragon Wars";
        address.innerHTML = "<a href=\"https://discord.gg/7ccREnQVuU\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "dragonWarsWins";
        daily.title = "Daily wins";
        daily.id = "dragonWarsWins";
        break;
    }

    case "bh": {
        mainTitle.innerHTML = "Bounty Hunters";
        address.innerHTML = "";
        lifetime.title = "Lifetime wins";
        daily.title = "Daily wins";
        lifetime.id = "bountyHuntersWins";
        daily.id = "bountyHuntersWins";
        break;
    }

    case "bd": {
        mainTitle.innerHTML = "Blocking Dead";
        address.innerHTML = "<a href=\"https://discord.gg/MkGKhztYcZ\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "blockingDeadWins";
        daily.title = "Daily wins";
        daily.id = "blockingDeadWins";
        break;
    }

    case "hns": {
        mainTitle.innerHTML = "Hide and Seek";
        address.innerHTML = "<a href=\"https://discord.gg/MkGKhztYcZ\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "hideAndSeekWins";
        daily.title = "Daily wins";
        daily.id = "hideAndSeekWins";
        break;
    }

    case "arc": {
        mainTitle.innerHTML = "Arcade overall";
        address.innerHTML = "<a href=\"https://discord.gg/J6UMkQrjpV\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "arcadeWins";
        daily.title = "Daily wins";
        daily.id = "arcadeWins";

        let killsL = document.createElement("div");
        killsL.setAttribute("class", "life");
        killsL.title = "Lifetime coins";
        main.appendChild(killsL);

        let killsD = document.createElement("div");
        killsD.setAttribute("class", "day");
        killsD.title = "Daily coins";
        main.appendChild(killsD);

        killsD.id = "arcadeCoins";

        killsL.id = "arcadeCoins";

        let agxpL = document.createElement("div");
        agxpL.setAttribute("class", "life");
        agxpL.title = "Lifetime arcade GXP";
        main.appendChild(agxpL);

        let agxpD = document.createElement("div");
        agxpD.setAttribute("class", "day");
        agxpD.title = "Daily arcade GXP";
        main.appendChild(agxpD);

        agxpD.id = "arcadeEXP";

        agxpL.id = "arcadeEXP";

        let gxpL = document.createElement("div");
        gxpL.setAttribute("class", "life");
        gxpL.title = "Lifetime GXP";
        main.appendChild(gxpL);

        let gxpD = document.createElement("div");
        gxpD.setAttribute("class", "day");
        gxpD.title = "Daily GXP";
        main.appendChild(gxpD);

        gxpD.id = "gxp";

        gxpL.id = "gxp";
        break;
    }

    case "z": {
        mainTitle.innerHTML = "Zombies";
        address.innerHTML = "<a href=\"https://discord.gg/2RDCTPWqVT\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "zombiesWins";
        daily.title = "Daily wins";
        daily.id = "zombiesWins";
        break;
    }

    case "pp": {
        mainTitle.innerHTML = "Pixel painters";
        lifetime.title = "Lifetime wins";
        lifetime.id = "pixelPaintersWins";
        daily.title = "Daily wins";
        daily.id = "pixelPaintersWins";
        break;
    }

    case "mw": {
        mainTitle.innerHTML = "Mini walls";
        address.innerHTML = "<a href=\"https://discord.gg/a3mFVpMPaf\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "miniWallsWins";
        daily.title = "Daily wins";
        daily.id = "miniWallsWins";
        break;
    }

    case "seasonal": {
        mainTitle.innerHTML = "Seasonal Arcade games";
        address.innerHTML = "<a href=\"https://discord.gg/Nq6ytH7sBk\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "simWins";
        daily.title = "Daily wins";
        daily.id = "simWins";
        break;
    }
    }

    mainTitle.innerHTML += " guilds";

    let lifetimes = document.querySelectorAll(".life");
    for(let e of lifetimes) {
        e.innerHTML = "Loading...";
    }

    let days = document.querySelectorAll(".day");
    for(let e of days) {
        e.innerHTML = "Loading...";
    }

    await refresh();
    setInterval(refresh, 25000);
}

/**
 *
 */
async function refresh() {
    let time = document.querySelector("time");
    let servertime = await fetch("https://hyarcade.xyz/resources/timeupdate", {
        cache: "no-store"
    });
    servertime = await servertime.text();
    let formatted = new Date(servertime);
    time.innerHTML = "Last database update : " + formatted.toLocaleTimeString();
    let accdata = await fetch("https://hyarcade.xyz/resources/guild.json", {
        cache: "no-store"
    });
    accdata = await accdata.text();
    await handleLifetimes(accdata);
    await handleTimed("day", accdata);
}

/**
 * @param accdata
 */
async function handleLifetimes(accdata) {
    accdata = JSON.parse(accdata);
    let elements = document.querySelectorAll(".life");
    for(let e of elements) {
        if(e.hasAttribute("extras")) {
            e.innerHTML =
                "<h2>" +
                e.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
                "</h2>" +
                formatData(
                    accdata,
                    (a, b) => {
                        if(a.extras == undefined || a.extras[e.getAttribute("extras")] == undefined) {
                            return -1;
                        } else if(b.extras == undefined || b.extras[e.getAttribute("extras")] == undefined) {
                            return 1;
                        }
                        return a.extras[e.getAttribute("extras")] - b.extras[e.getAttribute("extras")];
                    },
                    (pos, acc) => {
                        if(acc.extras == undefined) {
                            return "";
                        }
                        return formatLine(pos, acc.name, acc.extras[e.getAttribute("extras")], acc.uuid);
                    }
                );
        } else if(e.hasAttribute("seasonalWins")) {
            e.innerHTML =
                "<h2>" +
                e.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
                "</h2>" +
                formatData(
                    accdata,
                    (a, b) => {
                        if(
                            a.seasonalWins == undefined ||
                            a.seasonalWins[e.getAttribute("seasonalWins")] == undefined
                        ) {
                            return -1;
                        } else if(
                            b.seasonalWins == undefined ||
                            b.seasonalWins[e.getAttribute("seasonalWins")] == undefined
                        ) {
                            return 1;
                        }
                        return (
                            a.seasonalWins[e.getAttribute("seasonalWins")] -
                            b.seasonalWins[e.getAttribute("seasonalWins")]
                        );
                    },
                    (pos, acc) => {
                        if(acc.seasonalWins == undefined) {
                            return "";
                        }
                        return formatLine(pos, acc.name, acc.seasonalWins[e.getAttribute("seasonalWins")], acc.uuid);
                    }
                );
        } else if(e.hasAttribute("zombies")) {
            e.innerHTML =
                "<h2>" +
                e.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
                "</h2>" +
                formatData(
                    accdata,
                    (a, b) => {
                        if(a.zombies == undefined || a.zombies[e.getAttribute("zombies")] == undefined) {
                            return -1;
                        } else if(b.zombies == undefined || b.zombies[e.getAttribute("zombies")] == undefined) {
                            return 1;
                        }
                        return a.zombies[e.getAttribute("zombies")] - b.zombies[e.getAttribute("zombies")];
                    },
                    (pos, acc) => {
                        if(acc.zombies == undefined) {
                            return "";
                        }
                        return formatLine(pos, acc.name, acc.zombies[e.getAttribute("zombies")], acc.uuid);
                    }
                );
        } else if(e.hasAttribute("miniWalls")) {
            e.innerHTML =
                "<h2>" +
                e.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
                "</h2>" +
                formatData(
                    accdata,
                    (a, b) => {
                        if(a.miniWalls == undefined || a.miniWalls[e.getAttribute("miniWalls")] == undefined) {
                            return -1;
                        } else if(b.miniWalls == undefined || b.miniWalls[e.getAttribute("miniWalls")] == undefined) {
                            return 1;
                        }
                        return a.miniWalls[e.getAttribute("miniWalls")] - b.miniWalls[e.getAttribute("miniWalls")];
                    },
                    (pos, acc) => {
                        if(acc.miniWalls == undefined) {
                            return "";
                        }
                        return formatLine(pos, acc.name, acc.miniWalls[e.getAttribute("miniWalls")], acc.uuid);
                    }
                );
        } else {
            e.innerHTML =
                "<h2>" +
                e.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
                "</h2>" +
                formatData(
                    accdata,
                    (a, b) => {
                        if(a[e.id] == undefined) {
                            return -1;
                        } else if(b[e.id] == undefined) {
                            return 1;
                        }
                        return a[e.id] - b[e.id];
                    },
                    (pos, acc) => {
                        return formatLine(pos, acc.name, acc[e.id], acc.uuid);
                    }
                );
        }
    }
}

/**
 * @param timetype
 * @param accdata
 */
async function handleTimed(timetype, accdata) {
    let accold = await fetch(`https://hyarcade.xyz/resources/guild.${timetype}.json`, {
        cache: "no-store"
    });
    accdata = JSON.parse(accdata);
    accold = await accold.text();
    accold = JSON.parse(accold);

    let elements = document.querySelectorAll(`.${timetype}`);
    for(let e of elements) {
        if(e.hasAttribute("extras")) {
            e.innerHTML =
                "<h2>" +
                e.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
                "</h2>" +
                formatTimed(
                    accdata,
                    accold,
                    (acc, oldAcc) => {
                        if(acc.extras == undefined) {
                            acc.extras = {};
                        }
                        if(oldAcc.extras == undefined) {
                            acc.extras = {};
                        }

                        if(acc.extras[e.getAttribute("extras")] == undefined) {
                            acc.extras[e.getAttribute("extras")] = 0;
                        }
                        if(oldAcc.extras[e.getAttribute("extras")] == undefined) {
                            oldAcc.extras[e.getAttribute("extras")] = 0;
                        }
                        acc.extras[e.getAttribute("extras")] -= oldAcc.extras[e.getAttribute("extras")];
                        return acc;
                    },
                    (a, b) => {
                        if(a.extras == undefined || a.extras[e.getAttribute("extras")] == undefined) {
                            return 1;
                        } else if(b.extras == undefined || b.extras[e.getAttribute("extras")] == undefined) {
                            return -1;
                        }
                        return a.extras[e.getAttribute("extras")] - b.extras[e.getAttribute("extras")];
                    },
                    (pos, acc) => {
                        if(acc.extras == undefined) {
                            return "";
                        }
                        return formatLine(pos, acc.name, acc.extras[e.getAttribute("extras")], acc.uuid);
                    }
                );
        } else if(e.hasAttribute("seasonalWins")) {
            e.innerHTML =
                "<h2>" +
                e.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
                "</h2>" +
                formatTimed(
                    accdata,
                    accold,
                    (acc, oldAcc) => {
                        if(acc.seasonalWins == undefined) {
                            acc.seasonalWins = {};
                        }
                        if(oldAcc.seasonalWins == undefined) {
                            acc.seasonalWins = {};
                        }

                        if(acc.seasonalWins[e.getAttribute("seasonalWins")] == undefined) {
                            acc.seasonalWins[e.getAttribute("seasonalWins")] = 0;
                        }
                        if(oldAcc.seasonalWins[e.getAttribute("seasonalWins")] == undefined) {
                            oldAcc.seasonalWins[e.getAttribute("seasonalWins")] = 0;
                        }
                        acc.seasonalWins[e.getAttribute("seasonalWins")] -=
                            oldAcc.seasonalWins[e.getAttribute("seasonalWins")];
                        return acc;
                    },
                    (a, b) => {
                        if(
                            a.seasonalWins == undefined ||
                            a.seasonalWins[e.getAttribute("seasonalWins")] == undefined
                        ) {
                            return 1;
                        } else if(
                            b.seasonalWins == undefined ||
                            b.seasonalWins[e.getAttribute("seasonalWins")] == undefined
                        ) {
                            return -1;
                        }
                        return (
                            a.seasonalWins[e.getAttribute("seasonalWins")] -
                            b.seasonalWins[e.getAttribute("seasonalWins")]
                        );
                    },
                    (pos, acc) => {
                        if(acc.seasonalWins == undefined) {
                            return "";
                        }
                        return formatLine(pos, acc.name, acc.seasonalWins[e.getAttribute("seasonalWins")], acc.uuid);
                    }
                );
        } else if(e.hasAttribute("zombies")) {
            e.innerHTML =
                "<h2>" +
                e.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
                "</h2>" +
                formatTimed(
                    accdata,
                    accold,
                    (acc, oldAcc) => {
                        if(acc.zombies == undefined) {
                            acc.zombies = {};
                        }
                        if(oldAcc.zombies == undefined) {
                            acc.zombies = {};
                        }

                        if(acc.zombies[e.getAttribute("zombies")] == undefined) {
                            acc.zombies[e.getAttribute("zombies")] = 0;
                        }
                        if(oldAcc.zombies[e.getAttribute("zombies")] == undefined) {
                            oldAcc.zombies[e.getAttribute("zombies")] = 0;
                        }
                        acc.zombies[e.getAttribute("zombies")] -= oldAcc.zombies[e.getAttribute("zombies")];
                        return acc;
                    },
                    (a, b) => {
                        if(a.zombies == undefined || a.zombies[e.getAttribute("zombies")] == undefined) {
                            return 1;
                        } else if(b.zombies == undefined || b.zombies[e.getAttribute("zombies")] == undefined) {
                            return -1;
                        }
                        return a.zombies[e.getAttribute("zombies")] - b.zombies[e.getAttribute("zombies")];
                    },
                    (pos, acc) => {
                        if(acc.zombies == undefined) {
                            return "";
                        }
                        return formatLine(pos, acc.name, acc.zombies[e.getAttribute("zombies")], acc.uuid);
                    }
                );
        } else if(e.hasAttribute("miniWalls")) {
            e.innerHTML =
                "<h2>" +
                e.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
                "</h2>" +
                formatTimed(
                    accdata,
                    accold,
                    (acc, oldAcc) => {
                        if(acc.miniWalls == undefined) {
                            acc.miniWalls = {};
                        }
                        if(oldAcc.miniWalls == undefined) {
                            acc.miniWalls = {};
                        }

                        if(acc.miniWalls[e.getAttribute("miniWalls")] == undefined) {
                            acc.miniWalls[e.getAttribute("miniWalls")] = 0;
                        }
                        if(oldAcc.miniWalls[e.getAttribute("miniWalls")] == undefined) {
                            oldAcc.miniWalls[e.getAttribute("miniWalls")] = 0;
                        }
                        acc.miniWalls[e.getAttribute("miniWalls")] -= oldAcc.miniWalls[e.getAttribute("miniWalls")];
                        return acc;
                    },
                    (a, b) => {
                        if(a.miniWalls == undefined || a.miniWalls[e.getAttribute("miniWalls")] == undefined) {
                            return 1;
                        } else if(b.miniWalls == undefined || b.miniWalls[e.getAttribute("miniWalls")] == undefined) {
                            return -1;
                        }
                        return a.miniWalls[e.getAttribute("miniWalls")] - b.miniWalls[e.getAttribute("miniWalls")];
                    },
                    (pos, acc) => {
                        if(acc.miniWalls == undefined) {
                            return "";
                        }
                        return formatLine(pos, acc.name, acc.miniWalls[e.getAttribute("miniWalls")], acc.uuid);
                    }
                );
        } else {
            e.innerHTML =
                "<h2>" +
                e.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
                "</h2>" +
                formatTimed(
                    accdata,
                    accold,
                    (acc, oldAcc) => {
                        if(oldAcc[e.id] == undefined) {
                            oldAcc[e.id] = 0;
                        }
                        if(acc[e.id] == undefined) {
                            acc[e.id] = 0;
                        }
                        acc[e.id] -= oldAcc[e.id];
                        return acc;
                    },
                    (a, b) => {
                        if(a[e.id] == undefined) {
                            return -1;
                        } else if(b[e.id] == undefined) {
                            return 1;
                        }
                        return a[e.id] - b[e.id];
                    },
                    (pos, acc) => {
                        if(acc != undefined) {
                            return formatLine(pos, acc.name, acc[e.id]);
                        } else {
                            return "";
                        }
                    }
                );
        }
    }
}

/**
 * @param accounts
 * @param sorter
 * @param printer
 */
function formatData(accounts, sorter, printer) {
    let str = "";
    accounts.sort(sorter);
    accounts.reverse();
    let len = Math.min(accounts.length, maxLength);
    for(let i = 0; i < len; i++) {
        let acc = accounts[i];
        str += `${printer(i + 1, acc)}`;
    }
    return str;
}

/**
 * @param accounts
 * @param oldAccounts
 * @param subtracter
 * @param sorter
 * @param printer
 */
function formatTimed(accounts, oldAccounts, subtracter, sorter, printer) {
    let str = "";
    let timedAccounts = [];
    for(let i = 0; i < oldAccounts.length; i++) {
        let oldAcc = oldAccounts[i];
        let acc = accounts.find((a) => oldAcc.uuid == a.uuid);
        timedAccounts.push(subtracter(acc, oldAcc));
    }

    timedAccounts.sort(sorter);
    timedAccounts.reverse();
    let len = Math.min(accounts.length, maxLength);
    for(let i = 0; i < len; i++) {
        let acc = timedAccounts[i];
        str += `${printer(i + 1, acc)}`;
    }
    return str;
}

/**
 * @param pos
 * @param name
 * @param value
 */
function formatLine(pos, name, value) {
    let longName = (pos + ") " + name + "                         ").slice(0, 21);
    if(value > 0) {
        return `${longName}: ${formatNum(value)}\n`;
    } else {
        return "";
    }
}

/**
 * @param number
 */
function formatNum(number) {
    let str = new Number(number);
    if(number == undefined) {
        return new Number(0).toLocaleString();
    } else {
        return str.toLocaleString();
    }
}

window.addEventListener("load", load);
