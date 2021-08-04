let maxLength = 25;
let interval;

/**
 *
 */
async function load() {
    let game = window.location.pathname.slice(0, -5);
    game = game.substring(game.lastIndexOf("/") + 1);
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

        let roundsL = document.createElement("div");
        roundsL.setAttribute("class", "life");
        roundsL.title = "Lifetime rounds";
        main.appendChild(roundsL);

        let roundsD = document.createElement("div");
        roundsD.setAttribute("class", "day");
        roundsD.title = "Daily rounds";
        main.appendChild(roundsD);

        roundsD.id = "hypixelSaysRounds";
        roundsD.setAttribute("extras", roundsD.id);

        roundsL.id = "hypixelSaysRounds";
        roundsL.setAttribute("extras", roundsL.id);
        break;
    }

    case "fh": {
        mainTitle.innerHTML = "Farm hunt";
        address.innerHTML = "<a href=\"https://discord.gg/fVgcvhtaWk\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
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

    case "hitw": {
        mainTitle.innerHTML = "Hole in the wall";
        address.innerHTML = "<a href=\"https://discord.gg/Gh24vw5b54\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
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

        let qPBL = document.createElement("div");
        qPBL.setAttribute("class", "life");
        qPBL.title = "Top qualifier PB";
        qPBL.id = "hitwQual";
        main.appendChild(qPBL);

        let qPBD = document.createElement("div");
        qPBD.setAttribute("class", "day");
        qPBD.title = "Daily Q increase";
        qPBD.id = "hitwQual";
        main.appendChild(qPBD);

        let fPBL = document.createElement("div");
        fPBL.setAttribute("class", "life");
        fPBL.title = "Top finals PB";
        fPBL.id = "hitwFinal";
        main.appendChild(fPBL);

        let fPBD = document.createElement("div");
        fPBD.setAttribute("class", "day");
        fPBD.title = "Daily F increase";
        fPBD.id = "hitwFinal";
        main.appendChild(fPBD);

        break;
    }

    case "fb": {
        mainTitle.innerHTML = "Football";
        address.innerHTML = "<a href=\"https://discord.gg/P5c5RSG2yF\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
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

        let killsL = document.createElement("div");
        killsL.setAttribute("class", "life");
        killsL.title = "Lifetime kills";
        main.appendChild(killsL);

        let killsD = document.createElement("div");
        killsD.setAttribute("class", "day");
        killsD.title = "Daily kills";
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

    case "gw": {
        mainTitle.innerHTML = "Galaxy Wars";
        address.innerHTML = "<a href=\"https://discord.gg/v9ZwqyZfYj\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "galaxyWarsWins";
        daily.title = "Daily wins";
        daily.id = "galaxyWarsWins";

        let killsL = document.createElement("div");
        killsL.setAttribute("class", "life");
        killsL.title = "Lifetime kills";
        main.appendChild(killsL);

        let killsD = document.createElement("div");
        killsD.setAttribute("class", "day");
        killsD.title = "Daily kills";
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

    case "dw": {
        mainTitle.innerHTML = "Dragon Wars";
        address.innerHTML = "<a href=\"https://discord.gg/7ccREnQVuU\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "dragonWarsWins";
        daily.title = "Daily wins";
        daily.id = "dragonWarsWins";

        let killsL = document.createElement("div");
        killsL.setAttribute("class", "life");
        killsL.title = "Lifetime kills";
        main.appendChild(killsL);

        let killsD = document.createElement("div");
        killsD.setAttribute("class", "day");
        killsD.title = "Daily kills";
        main.appendChild(killsD);

        killsD.id = "dragonWarsKills";
        killsD.setAttribute("extras", killsD.id);

        killsL.id = "dragonWarsKills";
        killsL.setAttribute("extras", killsL.id);
        break;
    }

    case "bh": {
        mainTitle.innerHTML = "Bounty Hunters";
        address.innerHTML = "";
        lifetime.title = "Lifetime wins";
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

    case "bd": {
        mainTitle.innerHTML = "Blocking Dead";
        address.innerHTML = "<a href=\"https://discord.gg/MkGKhztYcZ\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "blockingDeadWins";
        daily.title = "Daily wins";
        daily.id = "blockingDeadWins";

        let killsL = document.createElement("div");
        killsL.setAttribute("class", "life");
        killsL.title = "Lifetime kills";
        main.appendChild(killsL);

        let killsD = document.createElement("div");
        killsD.setAttribute("class", "day");
        killsD.title = "Daily kills";
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

    case "hns": {
        mainTitle.innerHTML = "Hide and Seek";
        address.innerHTML = "<a href=\"https://discord.gg/MkGKhztYcZ\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "hideAndSeekWins";
        daily.title = "Daily wins";
        daily.id = "hideAndSeekWins";

        let seekerL = document.createElement("div");
        seekerL.setAttribute("class", "life");
        seekerL.title = "Lifetime seeker wins";
        main.appendChild(seekerL);

        let seekerD = document.createElement("div");
        seekerD.setAttribute("class", "day");
        seekerD.title = "Daily seeker wins";
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

    case "arc": {
        mainTitle.innerHTML = "Arcade overall";
        address.innerHTML = "<a href=\"https://discord.gg/J6UMkQrjpV\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "arcadeWins";
        daily.title = "Daily wins";
        daily.id = "arcadeWins";

        let combinedWinsL = document.createElement("div");
        combinedWinsL.setAttribute("class", "life");
        combinedWinsL.title = "Lifetime combined wins";
        combinedWinsL.id = "combinedArcadeWins";
        main.appendChild(combinedWinsL);

        let combinedWinsD = document.createElement("div");
        combinedWinsD.setAttribute("class", "day");
        combinedWinsD.title = "Daily combined wins";
        combinedWinsD.id = "combinedArcadeWins";
        main.appendChild(combinedWinsD);

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

        let apL = document.createElement("div");
        apL.setAttribute("class", "life");
        apL.title = "Lifetime AP";
        apL.id = "achievementPoints";
        main.appendChild(apL);

        let apD = document.createElement("div");
        apD.setAttribute("class", "day");
        apD.title = "Daily AP";
        apD.id = "achievementPoints";
        main.appendChild(apD);

        break;
    }

    case "z": {
        mainTitle.innerHTML = "Zombies";
        address.innerHTML = "<a href=\"https://discord.gg/2RDCTPWqVT\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "zombiesWins";
        daily.title = "Daily wins";
        daily.id = "zombiesWins";

        let deWinsL = document.createElement("div");
        deWinsL.setAttribute("class", "life");
        deWinsL.title = "Lifetime Dead End wins";
        deWinsL.id = "wins_zombies_deadend";
        deWinsL.setAttribute("zombies", deWinsL.id);
        main.appendChild(deWinsL);

        let deWinsD = document.createElement("div");
        deWinsD.setAttribute("class", "day");
        deWinsD.title = "Daily Dead End wins";
        deWinsD.id = "wins_zombies_deadend";
        deWinsD.setAttribute("zombies", deWinsD.id);
        main.appendChild(deWinsD);

        let bbWinsL = document.createElement("div");
        bbWinsL.setAttribute("class", "life");
        bbWinsL.title = "Lifetime Bad Blood wins";
        bbWinsL.id = "wins_zombies_badblood";
        bbWinsL.setAttribute("zombies", bbWinsL.id);
        main.appendChild(bbWinsL);

        let bbWinsD = document.createElement("div");
        bbWinsD.setAttribute("class", "day");
        bbWinsD.title = "Daily Bad Blood wins";
        bbWinsD.id = "wins_zombies_badblood";
        bbWinsD.setAttribute("zombies", bbWinsD.id);
        main.appendChild(bbWinsD);

        let aaWinsL = document.createElement("div");
        aaWinsL.setAttribute("class", "life");
        aaWinsL.title = "Lifetime Alien wins";
        aaWinsL.id = "wins_zombies_alienarcadium";
        aaWinsL.setAttribute("zombies", aaWinsL.id);
        main.appendChild(aaWinsL);

        let aaWinsD = document.createElement("div");
        aaWinsD.setAttribute("class", "day");
        aaWinsD.title = "Daily Alien wins";
        aaWinsD.id = "wins_zombies_alienarcadium";
        aaWinsD.setAttribute("zombies", aaWinsD.id);
        main.appendChild(aaWinsD);

        let z1L = document.createElement("div");
        z1L.setAttribute("class", "life");
        z1L.title = "Lifetime rounds";
        z1L.id = "total_rounds_survived_zombies";
        z1L.setAttribute("zombies", z1L.id);
        main.appendChild(z1L);

        let z1D = document.createElement("div");
        z1D.setAttribute("class", "day");
        z1D.title = "Daily rounds";
        z1D.id = "total_rounds_survived_zombies";
        z1D.setAttribute("zombies", z1D.id);
        main.appendChild(z1D);

        let z2L = document.createElement("div");
        z2L.setAttribute("class", "life");
        z2L.title = "Lifetime deaths";
        z2L.id = "deaths_zombies";
        z2L.setAttribute("zombies", z2L.id);
        main.appendChild(z2L);

        let z2D = document.createElement("div");
        z2D.setAttribute("class", "day");
        z2D.title = "Daily deaths";
        z2D.id = "deaths_zombies";
        z2D.setAttribute("zombies", z2D.id);
        main.appendChild(z2D);

        let z3L = document.createElement("div");
        z3L.setAttribute("class", "life");
        z3L.title = "Lifetime revives";
        z3L.id = "players_revived_zombies";
        z3L.setAttribute("zombies", z3L.id);
        main.appendChild(z3L);

        let z3D = document.createElement("div");
        z3D.setAttribute("class", "day");
        z3D.title = "Daily revives";
        z3D.id = "players_revived_zombies";
        z3D.setAttribute("zombies", z3D.id);
        main.appendChild(z3D);
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

        let mw1L = document.createElement("div");
        mw1L.setAttribute("class", "life");
        mw1L.title = "Lifetime kills";
        mw1L.id = "kills";
        mw1L.setAttribute("miniWalls", mw1L.id);
        main.appendChild(mw1L);

        let mw1D = document.createElement("div");
        mw1D.setAttribute("class", "day");
        mw1D.title = "Daily kills";
        mw1D.id = "kills";
        mw1D.setAttribute("miniWalls", mw1D.id);
        main.appendChild(mw1D);

        let mw2L = document.createElement("div");
        mw2L.setAttribute("class", "life");
        mw2L.title = "Lifetime deaths";
        mw2L.id = "deaths";
        mw2L.setAttribute("miniWalls", mw2L.id);
        main.appendChild(mw2L);

        let mw2D = document.createElement("div");
        mw2D.setAttribute("class", "day");
        mw2D.title = "Daily deaths";
        mw2D.id = "deaths";
        mw2D.setAttribute("miniWalls", mw2D.id);
        main.appendChild(mw2D);

        let mw3L = document.createElement("div");
        mw3L.setAttribute("class", "life");
        mw3L.title = "Lifetime final kills";
        mw3L.id = "finalKills";
        mw3L.setAttribute("miniWalls", mw3L.id);
        main.appendChild(mw3L);

        let mw3D = document.createElement("div");
        mw3D.setAttribute("class", "day");
        mw3D.title = "Daily final kills";
        mw3D.id = "finalKills";
        mw3D.setAttribute("miniWalls", mw3D.id);
        main.appendChild(mw3D);

        let mw4L = document.createElement("div");
        mw4L.setAttribute("class", "life");
        mw4L.title = "Lifetime wither kills";
        mw4L.id = "witherKills";
        mw4L.setAttribute("miniWalls", mw4L.id);
        main.appendChild(mw4L);

        let mw4D = document.createElement("div");
        mw4D.setAttribute("class", "day");
        mw4D.title = "Daily wither kills";
        mw4D.id = "witherKills";
        mw4D.setAttribute("miniWalls", mw4D.id);
        main.appendChild(mw4D);

        let mw5L = document.createElement("div");
        mw5L.setAttribute("class", "life");
        mw5L.title = "Lifetime wither damage";
        mw5L.id = "witherDamage";
        mw5L.setAttribute("miniWalls", mw5L.id);
        main.appendChild(mw5L);

        let mw5D = document.createElement("div");
        mw5D.setAttribute("class", "day");
        mw5D.title = "Daily wither damage";
        mw5D.id = "witherDamage";
        mw5D.setAttribute("miniWalls", mw5D.id);
        main.appendChild(mw5D);

        break;
    }

    case "seasonal": {
        mainTitle.innerHTML = "Seasonal Arcade games";
        address.innerHTML = "<a href=\"https://discord.gg/Nq6ytH7sBk\">Discord Invite</a>";
        lifetime.title = "Lifetime wins";
        lifetime.id = "simTotal";
        daily.title = "Daily wins";
        daily.id = "simTotal";

        let mw1L = document.createElement("div");
        mw1L.setAttribute("class", "life");
        mw1L.title = "Lifetime easter wins";
        mw1L.id = "easter";
        mw1L.setAttribute("seasonalWins", mw1L.id);
        main.appendChild(mw1L);

        let mw1D = document.createElement("div");
        mw1D.setAttribute("class", "day");
        mw1D.title = "Daily easter wins";
        mw1D.id = "easter";
        mw1D.setAttribute("seasonalWins", mw1D.id);
        main.appendChild(mw1D);

        let mw2L = document.createElement("div");
        mw2L.setAttribute("class", "life");
        mw2L.title = "Lifetime scuba wins";
        mw2L.id = "scuba";
        mw2L.setAttribute("seasonalWins", mw2L.id);
        main.appendChild(mw2L);

        let mw2D = document.createElement("div");
        mw2D.setAttribute("class", "day");
        mw2D.title = "Daily scuba wins";
        mw2D.id = "scuba";
        mw2D.setAttribute("seasonalWins", mw2D.id);
        main.appendChild(mw2D);

        let mw3L = document.createElement("div");
        mw3L.setAttribute("class", "life");
        mw3L.title = "Lifetime halloween wins";
        mw3L.id = "halloween";
        mw3L.setAttribute("seasonalWins", mw3L.id);
        main.appendChild(mw3L);

        let mw3D = document.createElement("div");
        mw3D.setAttribute("class", "day");
        mw3D.title = "Daily halloween wins";
        mw3D.id = "halloween";
        mw3D.setAttribute("seasonalWins", mw3D.id);
        main.appendChild(mw3D);

        let mw4L = document.createElement("div");
        mw4L.setAttribute("class", "life");
        mw4L.title = "Lifetime grinch wins";
        mw4L.id = "grinch";
        mw4L.setAttribute("seasonalWins", mw4L.id);
        main.appendChild(mw4L);

        let mw4D = document.createElement("div");
        mw4D.setAttribute("class", "day");
        mw4D.title = "Daily grinch wins";
        mw4D.id = "grinch";
        mw4D.setAttribute("seasonalWins", mw4D.id);
        main.appendChild(mw4D);

        break;
    }

    case "ctw": {
        mainTitle.innerHTML = "Capture the wool";
        address.innerHTML = "<a href=\"https://discord.gg/3B55bUcVKH\">Discord Invite</a>";
        lifetime.title = "Lifetime Wool";
        lifetime.id = "ctwWoolCaptured";
        daily.title = "Daily wool";
        daily.id = "ctwWoolCaptured";

        let killsL = document.createElement("div");
        killsL.setAttribute("class", "life");
        killsL.title = "Lifetime Kills";
        main.appendChild(killsL);

        let killsD = document.createElement("div");
        killsD.setAttribute("class", "day");
        killsD.title = "Daily kills";
        main.appendChild(killsD);

        killsD.id = "ctwKills";

        killsL.id = "ctwKills";
        break;
    }
    }

    let lifetimes = document.querySelectorAll(".life");
    for(let e of lifetimes) {
        e.innerHTML = "Loading...";
    }

    let days = document.querySelectorAll(".day");
    for(let e of days) {
        e.innerHTML = "Loading...";
    }

    await refresh();
    clearInterval(interval);
    interval = setInterval(refresh, 300000);
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
    await handleLifetimes();
    await handleTimed("day");
}

/**
 *
 */
async function handleLifetimes() {
    let elements = document.querySelectorAll(".life");
    for(let e of elements) {
        await getLeaderboards(e);
    }
}

/**
 * 
 * @param {Element} element 
 */
async function getLeaderboards(element) {
    let lb = [];
    if(element.hasAttribute("extras")) {
        console.info(`fetching https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("extras")}&category=extras`);
        let raw = await fetch(`https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("extras")}&category=extras`);
        lb = await raw.json();
    } else if(element.hasAttribute("seasonalWins")) {
        console.info(`fetching https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("seasonalWins")}&category=seasonalWins`);
        let raw = await fetch(`https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("seasonalWins")}&category=seasonalWins`);
        lb = await raw.json();
    } else if(element.hasAttribute("zombies")) {
        console.info(`fetching https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("seasonalWins")}&category=seasonalWins`);
        let raw = await fetch(`https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("zombies")}&category=zombies`);
        lb = await raw.json();
    } else if(element.hasAttribute("miniWalls")) {
        console.info(`fetching https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("miniWalls")}&category=miniWalls`);
        let raw = await fetch(`https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("miniWalls")}&category=miniWalls`);
        lb = await raw.json();
    } else {
        console.info(`fetching https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("id")}`);
        let raw = await fetch(`https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("id")}`);
        lb = await raw.json();
    }

    let text = "";
    for(let i = 0; i < Math.min(maxLength, lb.length); i++) {
        if(element.hasAttribute("extras")) {
            text += formatLine(i + 1, lb[i].name, lb[i].extras[element.getAttribute("extras")], lb[i].uuid);
        } else if(element.hasAttribute("seasonalWins")) {
            text += formatLine(i + 1, lb[i].name, lb[i].seasonalWins[element.getAttribute("seasonalWins")], lb[i].uuid);
        } else if(element.hasAttribute("zombies")) {
            text += formatLine(i + 1, lb[i].name, lb[i].zombies[element.getAttribute("zombies")], lb[i].uuid);
        } else if(element.hasAttribute("miniWalls")) {
            text += formatLine(i + 1, lb[i].name, lb[i].miniWalls[element.getAttribute("miniWalls")], lb[i].uuid);
        } else {
            text += formatLine(i + 1, lb[i].name, lb[i][element.getAttribute("id")], lb[i].uuid);
        }
    }

    element.innerHTML =
        "<h2>" +
        element.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
        "</h2>" +
        text;

}

/**
 * @param timetype
 */
async function handleTimed(timetype) {
    let elements = document.querySelectorAll(`.${timetype}`);
    for(let e of elements) {
        await getDaily(e, timetype);
    }
}

/**
 * 
 * @param {Element} element 
 * @param timetype
 */
async function getDaily(element, timetype) {
    let lb = [];
    if(element.hasAttribute("extras")) {
        console.info(`fetching https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("extras")}&category=extras&time=${timetype}`);
        let raw = await fetch(`https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("extras")}&category=extras&time=${timetype}`);
        lb = await raw.json();
    } else if(element.hasAttribute("seasonalWins")) {
        console.info(`fetching https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("seasonalWins")}&category=seasonalWins&time=${timetype}`);
        let raw = await fetch(`https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("seasonalWins")}&category=seasonalWins&time=${timetype}`);
        lb = await raw.json();
    } else if(element.hasAttribute("zombies")) {
        console.info(`fetching https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("seasonalWins")}&category=seasonalWins&time=${timetype}`);
        let raw = await fetch(`https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("zombies")}&category=zombies&time=${timetype}`);
        lb = await raw.json();
    } else if(element.hasAttribute("miniWalls")) {
        console.info(`fetching https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("miniWalls")}&category=miniWalls&time=${timetype}`);
        let raw = await fetch(`https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("miniWalls")}&category=miniWalls&time=${timetype}`);
        lb = await raw.json();
    } else {
        console.info(`fetching https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("id")}&time=${timetype}`);
        let raw = await fetch(`https://cdn.hyarcade.xyz/leaderboard?path=${element.getAttribute("id")}&time=${timetype}`);
        lb = await raw.json();
    }

    let text = "";
    for(let i = 0; i < Math.min(maxLength, lb.length); i++) {
        if(element.hasAttribute("extras")) {
            text += formatLine(i + 1, lb[i].name, lb[i].extras[element.getAttribute("extras")], lb[i].uuid);
        } else if(element.hasAttribute("seasonalWins")) {
            text += formatLine(i + 1, lb[i].name, lb[i].seasonalWins[element.getAttribute("seasonalWins")], lb[i].uuid);
        } else if(element.hasAttribute("zombies")) {
            text += formatLine(i + 1, lb[i].name, lb[i].zombies[element.getAttribute("zombies")], lb[i].uuid);
        } else if(element.hasAttribute("miniWalls")) {
            text += formatLine(i + 1, lb[i].name, lb[i].miniWalls[element.getAttribute("miniWalls")], lb[i].uuid);
        } else {
            text += formatLine(i + 1, lb[i].name, lb[i][element.getAttribute("id")], lb[i].uuid);
        }
    }

    element.innerHTML =
        "<h2>" +
        element.getAttribute("title").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") +
        "</h2>" +
        text;
}

/**
 * @param pos
 * @param name
 * @param value
 * @param uuid
 */
function formatLine(pos, name, value, uuid) {
    let longName = (pos + ") " + name + "                         ").slice(0, 21);
    longName = `<a href="player.html?q=${uuid}">${longName}</a>`;
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
