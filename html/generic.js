let maxLength = 25;

async function load() {
    let game = window.location.pathname.slice(0,-5);
    game = game.substring(game.lastIndexOf('/') + 1);
    let guildpage = document.querySelector(".guildver");
    guildpage.setAttribute("href", "./guilds/" + game + ".html");
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
        case "pg" : {
            mainTitle.innerHTML = "Party games"
            address.innerHTML = '<a href="https://discord.gg/kVSdPevCwm">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "wins";
            daily.title = "Daily wins"
            daily.id = "wins";
            break;
        }

        case "hs" : {
            mainTitle.innerHTML = "Hypixel Says"
            address.innerHTML = '<a href="https://discord.gg/GzjN5c4zze">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "hypixelSaysWins";
            daily.title = "Daily wins"
            daily.id = "hypixelSaysWins";

            let roundsL = document.createElement("div");
            roundsL.setAttribute("class", "life");
            roundsL.title = "Lifetime rounds"
            main.appendChild(roundsL);

            let roundsD = document.createElement("div");
            roundsD.setAttribute("class", "day");
            roundsD.title = "Daily rounds"
            main.appendChild(roundsD);

            roundsD.id = "hypixelSaysRounds";
            roundsD.setAttribute("extras", roundsD.id);

            roundsL.id = "hypixelSaysRounds";
            roundsL.setAttribute("extras", roundsL.id); 
            break;
        }

        case "fh" : {
            mainTitle.innerHTML = "Farm hunt"
            address.innerHTML = '<a href="https://discord.gg/fVgcvhtaWk">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "farmhuntWins";
            daily.title = "Daily wins";
            daily.id = "farmhuntWins";

            let shitL = document.createElement("div");
            shitL.setAttribute("class", "life");
            shitL.title = "Lifetime poop";
            main.appendChild(shitL);

            let shitD = document.createElement("div");
            shitD.setAttribute("class", "day");
            shitD.title = "Daily poop";
            main.appendChild(shitD);

            shitD.id = "farmhuntShit";

            shitL.id = "farmhuntShit";
            break;
        }

        case "hitw" : {
            mainTitle.innerHTML = "Hole in the wall"
            address.innerHTML = '<a href="https://discord.gg/Gh24vw5b54">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "hitwWins";
            daily.title = "Daily wins";
            daily.id = "hitwWins";

            let roundsL = document.createElement("div");
            roundsL.setAttribute("class", "life");
            roundsL.title = "Lifetime walls";
            roundsL.id = "hitwRounds";
            main.appendChild(roundsL);

            let roundsD = document.createElement("div");
            roundsD.setAttribute("class", "day");
            roundsD.title = "Daily walls";
            roundsD.id = "hitwRounds";
            main.appendChild(roundsD);

            break;
        }

        case "fb" : {
            mainTitle.innerHTML = "Football"
            address.innerHTML = '<a href="https://discord.gg/P5c5RSG2yF">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            daily.title = "Daily wins";

            lifetime.id = "footballWins";
            daily.id = "footballWins";

            let goalsL = document.createElement("div");
            goalsL.setAttribute("class", "life");
            goalsL.title = "Lifetime goals";
            main.appendChild(goalsL);
            
            let goalsD = document.createElement("div");
            goalsD.setAttribute("class", "day");
            goalsD.title = "Daily goals";
            main.appendChild(goalsD);

            goalsD.id = "footballGoals";
            goalsD.setAttribute("extras", goalsD.id);

            goalsL.id = "footballGoals";
            goalsL.setAttribute("extras", goalsL.id);



            let pkickL = document.createElement("div");
            pkickL.setAttribute("class", "life");
            pkickL.title = "Lifetime power kicks";
            main.appendChild(pkickL);
            
            let pkickD = document.createElement("div");
            pkickD.setAttribute("class", "day");
            pkickD.title = "Daily power kicks";
            main.appendChild(pkickD);

            pkickD.id = "footballPKicks";
            pkickD.setAttribute("extras", pkickD.id);

            pkickL.id = "footballPKicks";
            pkickL.setAttribute("extras", pkickL.id);

            let kickL = document.createElement("div");
            kickL.setAttribute("class", "life");
            kickL.title = "Lifetime kicks";
            kickL.id = "hitwRounds";
            main.appendChild(kickL);

            let kickD = document.createElement("div");
            kickD.setAttribute("class", "day");
            kickD.title = "Daily kicks";
            kickD.id = "hitwRounds";
            main.appendChild(kickD);

            kickD.id = "footballKicks";
            kickD.setAttribute("extras", kickD.id);

            kickL.id = "footballKicks";
            kickL.setAttribute("extras", kickL.id);


            break;
        }

        case "es" : {
            mainTitle.innerHTML = "Ender spleef"
            address.innerHTML = '<a href="https://discord.gg/9xRhumdEyq">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "enderSpleefWins";
            daily.title = "Daily wins"
            daily.id = "enderSpleefWins";
            break;
        }

        case "to" : {
            mainTitle.innerHTML = "Throw out"
            address.innerHTML = '<a href="https://discord.gg/2sMpvqtJYh">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "throwOutWins";
            daily.title = "Daily wins"
            daily.id = "throwOutWins";

            let killsL = document.createElement("div");
            killsL.setAttribute("class", "life");
            killsL.title = "Lifetime kills"
            main.appendChild(killsL);

            let killsD = document.createElement("div");
            killsD.setAttribute("class", "day");
            killsD.title = "Daily kills"
            main.appendChild(killsD);

            killsD.id = "throwOutKills";
            killsD.setAttribute("extras", killsD.id);

            killsL.id = "throwOutKills";
            killsL.setAttribute("extras", killsL.id); 

            let deathL = document.createElement("div");
            deathL.setAttribute("class", "life");
            deathL.title = "Lifetime deaths";
            main.appendChild(deathL);

            let deathD = document.createElement("div");
            deathD.setAttribute("class", "day");
            deathD.title = "Daily deaths";
            main.appendChild(deathD);

            deathD.id = "throwOutDeaths";
            deathD.setAttribute("extras", deathD.id);

            deathL.id = "throwOutDeaths";
            deathL.setAttribute("extras", deathL.id);
            break;
        }

        case "gw" : {
            mainTitle.innerHTML = "Galaxy Wars"
            address.innerHTML = '<a href="https://discord.gg/v9ZwqyZfYj">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "galaxyWarsWins";
            daily.title = "Daily wins"
            daily.id = "galaxyWarsWins";

            let killsL = document.createElement("div");
            killsL.setAttribute("class", "life");
            killsL.title = "Lifetime kills"
            main.appendChild(killsL);

            let killsD = document.createElement("div");
            killsD.setAttribute("class", "day");
            killsD.title = "Daily kills"
            main.appendChild(killsD);

            killsD.id = "galaxyWarsKills";
            killsD.setAttribute("extras", killsD.id);

            killsL.id = "galaxyWarsKills";
            killsL.setAttribute("extras", killsL.id); 

            let deathL = document.createElement("div");
            deathL.setAttribute("class", "life");
            deathL.title = "Lifetime deaths";
            main.appendChild(deathL);

            let deathD = document.createElement("div");
            deathD.setAttribute("class", "day");
            deathD.title = "Daily deaths";
            main.appendChild(deathD);

            deathD.id = "galaxyWarsDeaths";
            deathD.setAttribute("extras", deathD.id);

            deathL.id = "galaxyWarsDeaths";
            deathL.setAttribute("extras", deathL.id);
            break;
        }

        case "dw" : {
            mainTitle.innerHTML = "Dragon Wars"
            address.innerHTML = '<a href="https://discord.gg/7ccREnQVuU">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "dragonWarsWins";
            daily.title = "Daily wins"
            daily.id = "dragonWarsWins";

            let killsL = document.createElement("div");
            killsL.setAttribute("class", "life");
            killsL.title = "Lifetime kills"
            main.appendChild(killsL);

            let killsD = document.createElement("div");
            killsD.setAttribute("class", "day");
            killsD.title = "Daily kills"
            main.appendChild(killsD);

            killsD.id = "dragonWarsKills";
            killsD.setAttribute("extras", killsD.id);

            killsL.id = "dragonWarsKills";
            killsL.setAttribute("extras", killsL.id);
            break;
        }

        case "bh" : {
            mainTitle.innerHTML = "Bounty Hunters"
            address.innerHTML = ''
            lifetime.title = "Lifetime wins"
            daily.title = "Daily wins";

            lifetime.id = "bountyHuntersWins";
            daily.id = "bountyHuntersWins";

            let killsL = document.createElement("div");
            killsL.setAttribute("class", "life");
            killsL.title = "Lifetime kills";
            main.appendChild(killsL);
            
            let killsD = document.createElement("div");
            killsD.setAttribute("class", "day");
            killsD.title = "Daily kills";
            main.appendChild(killsD);

            killsD.id = "bountyHuntersKills";
            killsD.setAttribute("extras", killsD.id);

            killsL.id = "bountyHuntersKills";
            killsL.setAttribute("extras", killsL.id);



            let hdshtL = document.createElement("div");
            hdshtL.setAttribute("class", "life");
            hdshtL.title = "Lifetime bounty kills";
            main.appendChild(hdshtL);
            
            let hdshtD = document.createElement("div");
            hdshtD.setAttribute("class", "day");
            hdshtD.title = "Daily bounty kills";
            main.appendChild(hdshtD);

            hdshtD.id = "bountyHuntersBountyKills";
            hdshtD.setAttribute("extras", hdshtD.id);

            hdshtL.id = "bountyHuntersBountyKills";
            hdshtL.setAttribute("extras", hdshtL.id);

            let deathL = document.createElement("div");
            deathL.setAttribute("class", "life");
            deathL.title = "Lifetime deaths";
            main.appendChild(deathL);

            let deathD = document.createElement("div");
            deathD.setAttribute("class", "day");
            deathD.title = "Daily deaths";
            main.appendChild(deathD);

            deathD.id = "bountyHuntersDeaths";
            deathD.setAttribute("extras", deathD.id);

            deathL.id = "bountyHuntersDeaths";
            deathL.setAttribute("extras", deathL.id);


            break;
        }

        case "bd" : {
            mainTitle.innerHTML = "Blocking Dead"
            address.innerHTML = '<a href="https://discord.gg/MkGKhztYcZ">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "blockingDeadWins";
            daily.title = "Daily wins"
            daily.id = "blockingDeadWins";

            let killsL = document.createElement("div");
            killsL.setAttribute("class", "life");
            killsL.title = "Lifetime kills"
            main.appendChild(killsL);

            let killsD = document.createElement("div");
            killsD.setAttribute("class", "day");
            killsD.title = "Daily kills"
            main.appendChild(killsD);

            killsD.id = "blockingDeadKills";
            killsD.setAttribute("extras", killsD.id);

            killsL.id = "blockingDeadKills";
            killsL.setAttribute("extras", killsL.id); 

            let headshotL = document.createElement("div");
            headshotL.setAttribute("class", "life");
            headshotL.title = "Lifetime headshots";
            main.appendChild(headshotL);

            let headshotD = document.createElement("div");
            headshotD.setAttribute("class", "day");
            headshotD.title = "Daily headshots";
            main.appendChild(headshotD);

            headshotD.id = "blockingDeadHeadshots";
            headshotD.setAttribute("extras", headshotD.id);

            headshotL.id = "blockingDeadHeadshots";
            headshotL.setAttribute("extras", headshotL.id);
            break;
        }

        case "hns" : {
            mainTitle.innerHTML = "Hide and Seek"
            address.innerHTML = '<a href="https://discord.gg/MkGKhztYcZ">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "hideAndSeekWins";
            daily.title = "Daily wins"
            daily.id = "hideAndSeekWins";

            let seekerL = document.createElement("div");
            seekerL.setAttribute("class", "life");
            seekerL.title = "Lifetime seeker wins"
            main.appendChild(seekerL);

            let seekerD = document.createElement("div");
            seekerD.setAttribute("class", "day");
            seekerD.title = "Daily seeker wins"
            main.appendChild(seekerD);

            seekerD.id = "HNSSeekerWins";
            seekerD.setAttribute("extras", seekerD.id);

            seekerL.id = "HNSSeekerWins";
            seekerL.setAttribute("extras", seekerL.id); 

            let hiderL = document.createElement("div");
            hiderL.setAttribute("class", "life");
            hiderL.title = "Lifetime hider wins";
            main.appendChild(hiderL);

            let hiderD = document.createElement("div");
            hiderD.setAttribute("class", "day");
            hiderD.title = "Daily hider wins";
            main.appendChild(hiderD);

            hiderD.id = "HNSHiderWins";
            hiderD.setAttribute("extras", hiderD.id);

            hiderL.id = "HNSHiderWins";
            hiderL.setAttribute("extras", hiderL.id);


            let hiderKL = document.createElement("div");
            hiderKL.setAttribute("class", "life");
            hiderKL.title = "Lifetime kills";
            main.appendChild(hiderKL);

            let hiderKD = document.createElement("div");
            hiderKD.setAttribute("class", "day");
            hiderKD.title = "Daily kills";
            main.appendChild(hiderKD);
            hiderKD.id = "hnsKills";
            hiderKL.id = "hnsKills";

            break;
        }

        case "arc" : {
            mainTitle.innerHTML = "Arcade overall"
            address.innerHTML = '<a href="https://discord.gg/J6UMkQrjpV">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "arcadeWins";
            daily.title = "Daily wins"
            daily.id = "arcadeWins";

            let killsL = document.createElement("div");
            killsL.setAttribute("class", "life");
            killsL.title = "Lifetime coins"
            main.appendChild(killsL);

            let killsD = document.createElement("div");
            killsD.setAttribute("class", "day");
            killsD.title = "Daily coins"
            main.appendChild(killsD);

            killsD.id = "arcadeCoins";

            killsL.id = "arcadeCoins";
            break;
        }

        case "z" : {
            mainTitle.innerHTML = "Zombies"
            address.innerHTML = '<a href="https://discord.gg/2RDCTPWqVT">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "zombiesWins";
            daily.title = "Daily wins"
            daily.id = "zombiesWins";
            
            let z1L = document.createElement("div");
            z1L.setAttribute("class", "life");
            z1L.title = "Lifetime rounds"
            z1L.id = "total_rounds_survived_zombies";
            z1L.setAttribute("zombies", z1L.id);
            main.appendChild(z1L);
            
            let z1D = document.createElement("div");
            z1D.setAttribute("class", "day");
            z1D.title = "Daily rounds"
            z1D.id = "total_rounds_survived_zombies";
            z1D.setAttribute("zombies", z1D.id); 
            main.appendChild(z1D);

            let z2L = document.createElement("div");
            z2L.setAttribute("class", "life");
            z2L.title = "Lifetime deaths"
            z2L.id = "deaths_zombies";
            z2L.setAttribute("zombies", z2L.id);
            main.appendChild(z2L);

            let z2D = document.createElement("div");
            z2D.setAttribute("class", "day");
            z2D.title = "Daily deaths"
            z2D.id = "deaths_zombies";
            z2D.setAttribute("zombies", z2D.id); 
            main.appendChild(z2D);


            let z3L = document.createElement("div");
            z3L.setAttribute("class", "life");
            z3L.title = "Lifetime revives"
            z3L.id = "players_revived_zombies";
            z3L.setAttribute("zombies", z3L.id);
            main.appendChild(z3L);

            let z3D = document.createElement("div");
            z3D.setAttribute("class", "day");
            z3D.title = "Daily revives"
            z3D.id = "players_revived_zombies";
            z3D.setAttribute("zombies", z3D.id); 
            main.appendChild(z3D);
            break;
        }

        case "pp" : {
            mainTitle.innerHTML = "Pixel painters"
            lifetime.title = "Lifetime wins"
            lifetime.id = "pixelPaintersWins";
            daily.title = "Daily wins"
            daily.id = "pixelPaintersWins";
            break;
        }

        case "mw" : {
            mainTitle.innerHTML = "Mini walls"
            address.innerHTML = '<a href="https://discord.gg/a3mFVpMPaf">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "miniWallsWins";
            daily.title = "Daily wins"
            daily.id = "miniWallsWins";

            let mw1L = document.createElement("div");
            mw1L.setAttribute("class", "life");
            mw1L.title = "Lifetime kills"
            mw1L.id = "kills";
            mw1L.setAttribute("miniWalls", mw1L.id);
            main.appendChild(mw1L);

            let mw1D = document.createElement("div");
            mw1D.setAttribute("class", "day");
            mw1D.title = "Daily kills"
            mw1D.id = "kills";
            mw1D.setAttribute("miniWalls", mw1D.id); 
            main.appendChild(mw1D);

            let mw2L = document.createElement("div");
            mw2L.setAttribute("class", "life");
            mw2L.title = "Lifetime deaths"
            mw2L.id = "deaths";
            mw2L.setAttribute("miniWalls", mw2L.id);
            main.appendChild(mw2L);

            let mw2D = document.createElement("div");
            mw2D.setAttribute("class", "day");
            mw2D.title = "Daily deaths"
            mw2D.id = "deaths";
            mw2D.setAttribute("miniWalls", mw2D.id); 
            main.appendChild(mw2D);

            let mw3L = document.createElement("div");
            mw3L.setAttribute("class", "life");
            mw3L.title = "Lifetime final kills"
            mw3L.id = "finalKills";
            mw3L.setAttribute("miniWalls", mw3L.id);
            main.appendChild(mw3L);

            let mw3D = document.createElement("div");
            mw3D.setAttribute("class", "day");
            mw3D.title = "Daily final kills"
            mw3D.id = "finalKills";
            mw3D.setAttribute("miniWalls", mw3D.id); 
            main.appendChild(mw3D);

            let mw4L = document.createElement("div");
            mw4L.setAttribute("class", "life");
            mw4L.title = "Lifetime wither kills"
            mw4L.id = "witherKills";
            mw4L.setAttribute("miniWalls", mw4L.id);
            main.appendChild(mw4L);

            let mw4D = document.createElement("div");
            mw4D.setAttribute("class", "day");
            mw4D.title = "Daily wither kills"
            mw4D.id = "witherKills";
            mw4D.setAttribute("miniWalls", mw4D.id);
            main.appendChild(mw4D);

            let mw5L = document.createElement("div");
            mw5L.setAttribute("class", "life");
            mw5L.title = "Lifetime wither damage"
            mw5L.id = "witherDamage";
            mw5L.setAttribute("miniWalls", mw5L.id);
            main.appendChild(mw5L);

            let mw5D = document.createElement("div");
            mw5D.setAttribute("class", "day");
            mw5D.title = "Daily wither damage"
            mw5D.id = "witherDamage";
            mw5D.setAttribute("miniWalls", mw5D.id); 
            main.appendChild(mw5D);

            break;
        }

        case "seasonal" : {
            mainTitle.innerHTML = "Seasonal Arcade games"
            address.innerHTML = '<a href="https://discord.gg/Nq6ytH7sBk">Discord Invite</a>'
            lifetime.title = "Lifetime wins"
            lifetime.id = "simTotal";
            daily.title = "Daily wins"
            daily.id = "simTotal";

            let mw1L = document.createElement("div");
            mw1L.setAttribute("class", "life");
            mw1L.title = "Lifetime easter wins"
            mw1L.id = "easter";
            mw1L.setAttribute("seasonalWins", mw1L.id);
            main.appendChild(mw1L);

            let mw1D = document.createElement("div");
            mw1D.setAttribute("class", "day");
            mw1D.title = "Daily easter wins"
            mw1D.id = "easter";
            mw1D.setAttribute("seasonalWins", mw1D.id); 
            main.appendChild(mw1D);

            let mw2L = document.createElement("div");
            mw2L.setAttribute("class", "life");
            mw2L.title = "Lifetime scuba wins"
            mw2L.id = "scuba";
            mw2L.setAttribute("seasonalWins", mw2L.id);
            main.appendChild(mw2L);

            let mw2D = document.createElement("div");
            mw2D.setAttribute("class", "day");
            mw2D.title = "Daily scuba wins"
            mw2D.id = "scuba";
            mw2D.setAttribute("seasonalWins", mw2D.id); 
            main.appendChild(mw2D);

            let mw3L = document.createElement("div");
            mw3L.setAttribute("class", "life");
            mw3L.title = "Lifetime halloween wins"
            mw3L.id = "halloween";
            mw3L.setAttribute("seasonalWins", mw3L.id);
            main.appendChild(mw3L);

            let mw3D = document.createElement("div");
            mw3D.setAttribute("class", "day");
            mw3D.title = "Daily halloween wins"
            mw3D.id = "halloween";
            mw3D.setAttribute("seasonalWins", mw3D.id); 
            main.appendChild(mw3D);

            let mw4L = document.createElement("div");
            mw4L.setAttribute("class", "life");
            mw4L.title = "Lifetime grinch wins"
            mw4L.id = "grinch";
            mw4L.setAttribute("seasonalWins", mw4L.id);
            main.appendChild(mw4L);

            let mw4D = document.createElement("div");
            mw4D.setAttribute("class", "day");
            mw4D.title = "Daily grinch wins"
            mw4D.id = "grinch";
            mw4D.setAttribute("seasonalWins", mw4D.id);
            main.appendChild(mw4D);

            break;
        }

    }

    await refresh();
    setInterval(refresh, 25000)

}

async function refresh() {
    let time = document.querySelector("time");
    let servertime = await fetch("https://hyarcade.xyz/resources/timeupdate", {cache : "no-store"});
    servertime = await servertime.text();
    let formatted = new Date(servertime);
    time.innerHTML = "Last database update : " + formatted.toLocaleTimeString();
    let accdata = await fetch("https://hyarcade.xyz/resources/accounts.json", { cache: "no-store" });
    accdata = await accdata.text();
    await handleLifetimes(accdata);
    await handleTimed("day", accdata);
}

async function handleLifetimes(accdata) {
    accdata = JSON.parse(accdata);
    let elements = document.querySelectorAll(".life");
    for(let e of elements) {
        if(e.hasAttribute("extras")) {
            e.innerHTML = "<h2>" + e.getAttribute("title") + "</h2>" + formatData(accdata,
                (a,b) => {
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
            e.innerHTML = "<h2>" + e.getAttribute("title") + "</h2>" + formatData(accdata,
                (a,b) => {
                    if(a.seasonalWins == undefined || a.seasonalWins[e.getAttribute("seasonalWins")] == undefined) {
                        return -1;
                    } else if(b.seasonalWins == undefined || b.seasonalWins[e.getAttribute("seasonalWins")] == undefined) {
                        return 1;
                    }
                    return a.seasonalWins[e.getAttribute("seasonalWins")] - b.seasonalWins[e.getAttribute("seasonalWins")];
                },
                (pos, acc) => {
                    if(acc.seasonalWins == undefined) {
                        return "";
                    }
                    return formatLine(pos, acc.name, acc.seasonalWins[e.getAttribute("seasonalWins")], acc.uuid);
                }
            );
        } else if(e.hasAttribute("zombies")) {
            e.innerHTML = "<h2>" + e.getAttribute("title") + "</h2>" + formatData(accdata,
                (a,b) => {
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
            e.innerHTML = "<h2>" + e.getAttribute("title") + "</h2>" + formatData(accdata,
                (a,b) => {
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
            e.innerHTML = "<h2>" + e.getAttribute("title") + "</h2>" + formatData(accdata, 
                (a,b) => {
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

async function handleTimed(timetype, accdata) {
    let accold = await fetch(`https://hyarcade.xyz/resources/accounts.${timetype}.json`, { cache: "no-store" });
    accdata = JSON.parse(accdata);
    accold = await accold.text();
    accold = JSON.parse(accold);

    let elements = document.querySelectorAll(`.${timetype}`);
    for(let e of elements) {
        if(e.hasAttribute("extras")) {
            e.innerHTML = "<h2>" + e.getAttribute("title") + "</h2>" + formatTimed(accdata, accold,
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
                (a,b) => {
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
            e.innerHTML = "<h2>" + e.getAttribute("title") + "</h2>" + formatTimed(accdata, accold,
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
                    acc.seasonalWins[e.getAttribute("seasonalWins")] -= oldAcc.seasonalWins[e.getAttribute("seasonalWins")];
                    return acc;
                },
                (a,b) => {
                    if(a.seasonalWins == undefined || a.seasonalWins[e.getAttribute("seasonalWins")] == undefined) {
                        return 1;
                    } else if(b.seasonalWins == undefined || b.seasonalWins[e.getAttribute("seasonalWins")] == undefined) {
                        return -1;
                    }
                    return a.seasonalWins[e.getAttribute("seasonalWins")] - b.seasonalWins[e.getAttribute("seasonalWins")];
                },
                (pos, acc) => {
                    if(acc.seasonalWins == undefined) {
                        return "";
                    }
                    return formatLine(pos, acc.name, acc.seasonalWins[e.getAttribute("seasonalWins")], acc.uuid);
                }
            );
        } else if(e.hasAttribute("zombies")) {
            e.innerHTML = "<h2>" + e.getAttribute("title") + "</h2>" + formatTimed(accdata, accold,
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
                (a,b) => {
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
            e.innerHTML = "<h2>" + e.getAttribute("title") + "</h2>" + formatTimed(accdata, accold,
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
                (a,b) => {
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
            e.innerHTML = "<h2>" + e.getAttribute("title") + "</h2>" + formatTimed(accdata, accold,
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
                (a,b) => {
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

function formatData(accounts, sorter, printer) {
    let str = "";
    accounts.sort(sorter);
    accounts.reverse();
    let len = Math.min(accounts.length, maxLength);
    for(let i = 0; i< len; i++) {
        let acc = accounts[i];
        str += `${printer(i+1 , acc)}`;
    }
    return str;
}

function formatTimed(accounts, oldAccounts, subtracter, sorter, printer) {
    let str = "";
    let timedAccounts = [];
    for(let i = 0; i < oldAccounts.length; i++) {
        let oldAcc = oldAccounts[i];
        let acc = accounts.find(a => oldAcc.uuid == a.uuid);
        timedAccounts.push(subtracter(acc, oldAcc));
    }


    timedAccounts.sort(sorter);
    timedAccounts.reverse();
    let len = Math.min(accounts.length, maxLength);
    for(let i = 0; i< len; i++) {
        let acc = timedAccounts[i];
        str += `${printer(i+1 , acc)}`;
    }
    return str;
}

function formatLine(pos, name, value, uuid) {
    let longName = (pos +  ") " + name + "                         ").slice(0, 21);
    longName = `<a href="player.html?q=${uuid}">${longName}</a>`
    if(value > 0) {
        return `${longName}: ${formatNum(value)}\n`;
    } else {
        return "";
    }
}

function maxValChange(val) {
    maxLength = val;
}

function formatNum(number) {
    let str = new Number(number);
    if (number == undefined) {
        return new Number(0).toLocaleString();
    } else {
        return str.toLocaleString();
    }
}

window.addEventListener("load", load);