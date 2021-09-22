let maxLength = 25;
let interval;


// eslint-disable-next-line
function maxValChange (val) {
  maxLength = val;
  refresh()
    .then(console.log)
    .catch(console.error);
}

/**
 *
 */
async function load () {
  let game = window.location.pathname.slice(0, -5);
  game = game.substring(game.lastIndexOf("/") + 1);
  const guildpage = document.querySelector(".guildver");
  guildpage.setAttribute("href", `./guilds/${game}.html`);
  const main = document.querySelector("main");
  const mainTitle = document.querySelector("h1");
  const address = document.querySelector("address");

  const lifetime = document.createElement("div");
  const daily = document.createElement("div");
  lifetime.setAttribute("class", "life");
  daily.setAttribute("class", "day");

  main.appendChild(lifetime);
  main.appendChild(daily);

  switch(game) {
  case "pg": {
    mainTitle.innerHTML = "Party games";
    address.innerHTML = "<a href=\"https://discord.gg/kVSdPevCwm\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "partyGames.wins";
    daily.title = "Daily wins";
    daily.id = "partyGames.wins";
    break;
  }

  case "hs": {
    mainTitle.innerHTML = "Hypixel Says";
    address.innerHTML = "<a href=\"https://discord.gg/GzjN5c4zze\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "hypixelSays.wins";
    daily.title = "Daily wins";
    daily.id = "hypixelSays.wins";

    const roundsL = document.createElement("div");
    roundsL.setAttribute("class", "life");
    roundsL.title = "Lifetime rounds";
    main.appendChild(roundsL);

    const roundsD = document.createElement("div");
    roundsD.setAttribute("class", "day");
    roundsD.title = "Daily rounds";
    main.appendChild(roundsD);

    roundsD.id = "hypixelSays.rounds";

    roundsL.id = "hypixelSays.rounds";
    break;
  }

  case "fh": {
    mainTitle.innerHTML = "Farm hunt";
    address.innerHTML = "<a href=\"https://discord.gg/fVgcvhtaWk\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "farmhunt.wins";
    daily.title = "Daily wins";
    daily.id = "farmhunt.wins";

    const shitL = document.createElement("div");
    shitL.setAttribute("class", "life");
    shitL.title = "Lifetime poop";
    main.appendChild(shitL);

    const shitD = document.createElement("div");
    shitD.setAttribute("class", "day");
    shitD.title = "Daily poop";
    main.appendChild(shitD);

    shitD.id = "farmhunt.poop";

    shitL.id = "farmhunt.poop";
    break;
  }

  case "hitw": {
    mainTitle.innerHTML = "Hole in the wall";
    address.innerHTML = "<a href=\"https://discord.gg/Gh24vw5b54\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "holeInTheWall.wins";
    daily.title = "Daily wins";
    daily.id = "holeInTheWall.wins";

    const roundsL = document.createElement("div");
    roundsL.setAttribute("class", "life");
    roundsL.title = "Lifetime walls";
    roundsL.id = "holeInTheWall.rounds";
    main.appendChild(roundsL);

    const roundsD = document.createElement("div");
    roundsD.setAttribute("class", "day");
    roundsD.title = "Daily walls";
    roundsD.id = "holeInTheWall.rounds";
    main.appendChild(roundsD);

    const qPBL = document.createElement("div");
    qPBL.setAttribute("class", "life");
    qPBL.title = "Top qualifier PB";
    qPBL.id = "holeInTheWall.qualifiers";
    main.appendChild(qPBL);

    const qPBD = document.createElement("div");
    qPBD.setAttribute("class", "day");
    qPBD.title = "Daily Q increase";
    qPBD.id = "holeInTheWall.qualifiers";
    main.appendChild(qPBD);

    const fPBL = document.createElement("div");
    fPBL.setAttribute("class", "life");
    fPBL.title = "Top finals PB";
    fPBL.id = "holeInTheWall.finals";
    main.appendChild(fPBL);

    const fPBD = document.createElement("div");
    fPBD.setAttribute("class", "day");
    fPBD.title = "Daily F increase";
    fPBD.id = "holeInTheWall.finals";
    main.appendChild(fPBD);

    break;
  }

  case "fb": {
    mainTitle.innerHTML = "Football";
    address.innerHTML = "<a href=\"https://discord.gg/P5c5RSG2yF\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    daily.title = "Daily wins";

    lifetime.id = "football.wins";
    daily.id = "football.wins";

    const goalsL = document.createElement("div");
    goalsL.setAttribute("class", "life");
    goalsL.title = "Lifetime goals";
    main.appendChild(goalsL);

    const goalsD = document.createElement("div");
    goalsD.setAttribute("class", "day");
    goalsD.title = "Daily goals";
    main.appendChild(goalsD);

    goalsD.id = "football.goals";

    goalsL.id = "football.goals";

    const pkickL = document.createElement("div");
    pkickL.setAttribute("class", "life");
    pkickL.title = "Lifetime power kicks";
    main.appendChild(pkickL);

    const pkickD = document.createElement("div");
    pkickD.setAttribute("class", "day");
    pkickD.title = "Daily power kicks";
    main.appendChild(pkickD);

    pkickD.id = "football.powerkicks";

    pkickL.id = "football.powerkicks";

    const kickL = document.createElement("div");
    kickL.setAttribute("class", "life");
    kickL.title = "Lifetime kicks";
    main.appendChild(kickL);

    const kickD = document.createElement("div");
    kickD.setAttribute("class", "day");
    kickD.title = "Daily kicks";
    main.appendChild(kickD);

    kickD.id = "football.goals";

    kickL.id = "football.goals";

    break;
  }

  case "es": {
    mainTitle.innerHTML = "Ender spleef";
    address.innerHTML = "<a href=\"https://discord.gg/9xRhumdEyq\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "enderSpleef.wins";
    daily.title = "Daily wins";
    daily.id = "enderSpleef.wins";
    break;
  }

  case "to": {
    mainTitle.innerHTML = "Throw out";
    address.innerHTML = "<a href=\"https://discord.gg/2sMpvqtJYh\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "throwOut.wins";
    daily.title = "Daily wins";
    daily.id = "throwOut.wins";

    const killsL = document.createElement("div");
    killsL.setAttribute("class", "life");
    killsL.title = "Lifetime kills";
    main.appendChild(killsL);

    const killsD = document.createElement("div");
    killsD.setAttribute("class", "day");
    killsD.title = "Daily kills";
    main.appendChild(killsD);

    killsD.id = "throwOut.kills";

    killsL.id = "throwOut.kills";

    const deathL = document.createElement("div");
    deathL.setAttribute("class", "life");
    deathL.title = "Lifetime deaths";
    main.appendChild(deathL);

    const deathD = document.createElement("div");
    deathD.setAttribute("class", "day");
    deathD.title = "Daily deaths";
    main.appendChild(deathD);

    deathD.id = "throwOut.deaths";

    deathL.id = "throwOut.deaths";
    break;
  }

  case "gw": {
    mainTitle.innerHTML = "Galaxy Wars";
    address.innerHTML = "<a href=\"https://discord.gg/v9ZwqyZfYj\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "galaxyWars.wins";
    daily.title = "Daily wins";
    daily.id = "galaxyWars.wins";

    const killsL = document.createElement("div");
    killsL.setAttribute("class", "life");
    killsL.title = "Lifetime kills";
    main.appendChild(killsL);

    const killsD = document.createElement("div");
    killsD.setAttribute("class", "day");
    killsD.title = "Daily kills";
    main.appendChild(killsD);

    killsD.id = "galaxyWars.kills";

    killsL.id = "galaxyWars.kills";

    const deathL = document.createElement("div");
    deathL.setAttribute("class", "life");
    deathL.title = "Lifetime deaths";
    main.appendChild(deathL);

    const deathD = document.createElement("div");
    deathD.setAttribute("class", "day");
    deathD.title = "Daily deaths";
    main.appendChild(deathD);

    deathD.id = "galaxyWars.deaths";

    deathL.id = "galaxyWars.deaths";
    break;
  }

  case "dw": {
    mainTitle.innerHTML = "Dragon Wars";
    address.innerHTML = "<a href=\"https://discord.gg/7ccREnQVuU\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "dragonWars.wins";
    daily.title = "Daily wins";
    daily.id = "dragonWars.wins";

    const killsL = document.createElement("div");
    killsL.setAttribute("class", "life");
    killsL.title = "Lifetime kills";
    main.appendChild(killsL);

    const killsD = document.createElement("div");
    killsD.setAttribute("class", "day");
    killsD.title = "Daily kills";
    main.appendChild(killsD);

    killsD.id = "dragonWars.kills";

    killsL.id = "dragonWars.kills";
    break;
  }

  case "bh": {
    mainTitle.innerHTML = "Bounty Hunters";
    address.innerHTML = "";
    lifetime.title = "Lifetime wins";
    daily.title = "Daily wins";

    lifetime.id = "bountyHunters.wins";
    daily.id = "bountyHunters.wins";

    const killsL = document.createElement("div");
    killsL.setAttribute("class", "life");
    killsL.title = "Lifetime kills";
    main.appendChild(killsL);

    const killsD = document.createElement("div");
    killsD.setAttribute("class", "day");
    killsD.title = "Daily kills";
    main.appendChild(killsD);

    killsD.id = "bountyHunters.kills";

    killsL.id = "bountyHunters.kills";

    const hdshtL = document.createElement("div");
    hdshtL.setAttribute("class", "life");
    hdshtL.title = "Lifetime bounty kills";
    main.appendChild(hdshtL);

    const hdshtD = document.createElement("div");
    hdshtD.setAttribute("class", "day");
    hdshtD.title = "Daily bounty kills";
    main.appendChild(hdshtD);

    hdshtD.id = "bountyHunters.bountyKills";

    hdshtL.id = "bountyHunters.bountyKills";

    const deathL = document.createElement("div");
    deathL.setAttribute("class", "life");
    deathL.title = "Lifetime deaths";
    main.appendChild(deathL);

    const deathD = document.createElement("div");
    deathD.setAttribute("class", "day");
    deathD.title = "Daily deaths";
    main.appendChild(deathD);

    deathD.id = "bountyHunters.deaths";

    deathL.id = "bountyHunters.deaths";

    break;
  }

  case "bd": {
    mainTitle.innerHTML = "Blocking Dead";
    address.innerHTML = "<a href=\"https://discord.gg/MkGKhztYcZ\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "blockingDead.wins";
    daily.title = "Daily wins";
    daily.id = "blockingDead.wins";

    const killsL = document.createElement("div");
    killsL.setAttribute("class", "life");
    killsL.title = "Lifetime kills";
    main.appendChild(killsL);

    const killsD = document.createElement("div");
    killsD.setAttribute("class", "day");
    killsD.title = "Daily kills";
    main.appendChild(killsD);

    killsD.id = "blockingDead.kills";

    killsL.id = "blockingDead.kills";

    const headshotL = document.createElement("div");
    headshotL.setAttribute("class", "life");
    headshotL.title = "Lifetime headshots";
    main.appendChild(headshotL);

    const headshotD = document.createElement("div");
    headshotD.setAttribute("class", "day");
    headshotD.title = "Daily headshots";
    main.appendChild(headshotD);

    headshotD.id = "blockingDead.headshots";

    headshotL.id = "blockingDead.headshots";
    break;
  }

  case "hns": {
    mainTitle.innerHTML = "Hide and Seek";
    address.innerHTML = "<a href=\"https://discord.gg/MkGKhztYcZ\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "hideAndSeek.wins";
    daily.title = "Daily wins";
    daily.id = "hideAndSeek.wins";

    const seekerL = document.createElement("div");
    seekerL.setAttribute("class", "life");
    seekerL.title = "Lifetime seeker wins";
    main.appendChild(seekerL);

    const seekerD = document.createElement("div");
    seekerD.setAttribute("class", "day");
    seekerD.title = "Daily seeker wins";
    main.appendChild(seekerD);

    seekerD.id = "hideAndSeek.seekerWins";

    seekerL.id = "hideAndSeek.seekerWins";

    const hiderL = document.createElement("div");
    hiderL.setAttribute("class", "life");
    hiderL.title = "Lifetime hider wins";
    main.appendChild(hiderL);

    const hiderD = document.createElement("div");
    hiderD.setAttribute("class", "day");
    hiderD.title = "Daily hider wins";
    main.appendChild(hiderD);

    hiderD.id = "hideAndSeek.hiderWins";

    hiderL.id = "hideAndSeek.hiderWins";

    const hiderKL = document.createElement("div");
    hiderKL.setAttribute("class", "life");
    hiderKL.title = "Lifetime kills";
    main.appendChild(hiderKL);

    const hiderKD = document.createElement("div");
    hiderKD.setAttribute("class", "day");
    hiderKD.title = "Daily kills";
    main.appendChild(hiderKD);
    hiderKD.id = "hideAndSeek.kills";
    hiderKL.id = "hideAndSeek.kills";

    break;
  }

  case "arc": {
    mainTitle.innerHTML = "Arcade overall";
    address.innerHTML = "<a href=\"https://discord.gg/J6UMkQrjpV\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "arcadeWins";
    daily.title = "Daily wins";
    daily.id = "arcadeWins";

    const combinedWinsL = document.createElement("div");
    combinedWinsL.setAttribute("class", "life");
    combinedWinsL.title = "Lifetime combined wins";
    combinedWinsL.id = "combinedArcadeWins";
    main.appendChild(combinedWinsL);

    const combinedWinsD = document.createElement("div");
    combinedWinsD.setAttribute("class", "day");
    combinedWinsD.title = "Daily combined wins";
    combinedWinsD.id = "combinedArcadeWins";
    main.appendChild(combinedWinsD);

    const killsL = document.createElement("div");
    killsL.setAttribute("class", "life");
    killsL.title = "Lifetime coins";
    main.appendChild(killsL);

    const killsD = document.createElement("div");
    killsD.setAttribute("class", "day");
    killsD.title = "Daily coins";
    main.appendChild(killsD);

    killsD.id = "arcadeCoins";

    killsL.id = "arcadeCoins";

    break;
  }

  case "z": {
    mainTitle.innerHTML = "Zombies";
    address.innerHTML = "<a href=\"https://discord.gg/2RDCTPWqVT\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "zombies.wins_zombies";
    daily.title = "Daily wins";
    daily.id = "zombies.wins_zombies";

    const deWinsL = document.createElement("div");
    deWinsL.setAttribute("class", "life");
    deWinsL.title = "Lifetime Dead End wins";
    deWinsL.id = "zombies.wins_zombies_deadend";
    main.appendChild(deWinsL);

    const deWinsD = document.createElement("div");
    deWinsD.setAttribute("class", "day");
    deWinsD.title = "Daily Dead End wins";
    deWinsD.id = "zombies.wins_zombies_deadend";
    main.appendChild(deWinsD);

    const bbWinsL = document.createElement("div");
    bbWinsL.setAttribute("class", "life");
    bbWinsL.title = "Lifetime Bad Blood wins";
    bbWinsL.id = "zombies.wins_zombies_badblood";
    main.appendChild(bbWinsL);

    const bbWinsD = document.createElement("div");
    bbWinsD.setAttribute("class", "day");
    bbWinsD.title = "Daily Bad Blood wins";
    bbWinsD.id = "zombies.wins_zombies_badblood";
    main.appendChild(bbWinsD);

    const aaWinsL = document.createElement("div");
    aaWinsL.setAttribute("class", "life");
    aaWinsL.title = "Lifetime Alien wins";
    aaWinsL.id = "zombies.wins_zombies_alienarcadium";
    main.appendChild(aaWinsL);

    const aaWinsD = document.createElement("div");
    aaWinsD.setAttribute("class", "day");
    aaWinsD.title = "Daily Alien wins";
    aaWinsD.id = "zombies.wins_zombies_alienarcadium";
    main.appendChild(aaWinsD);

    const z1L = document.createElement("div");
    z1L.setAttribute("class", "life");
    z1L.title = "Lifetime rounds";
    z1L.id = "zombies.total_rounds_survived_zombies";
    main.appendChild(z1L);

    const z1D = document.createElement("div");
    z1D.setAttribute("class", "day");
    z1D.title = "Daily rounds";
    z1D.id = "zombies.total_rounds_survived_zombies";
    main.appendChild(z1D);

    const z2L = document.createElement("div");
    z2L.setAttribute("class", "life");
    z2L.title = "Lifetime deaths";
    z2L.id = "zombies.deaths_zombies";
    main.appendChild(z2L);

    const z2D = document.createElement("div");
    z2D.setAttribute("class", "day");
    z2D.title = "Daily deaths";
    z2D.id = "zombies.deaths_zombies";
    main.appendChild(z2D);

    const z3L = document.createElement("div");
    z3L.setAttribute("class", "life");
    z3L.title = "Lifetime revives";
    z3L.id = "zombies.players_revived_zombies";
    main.appendChild(z3L);

    const z3D = document.createElement("div");
    z3D.setAttribute("class", "day");
    z3D.title = "Daily revives";
    z3D.id = "zombies.players_revived_zombies";
    main.appendChild(z3D);
    break;
  }

  case "pp": {
    mainTitle.innerHTML = "Pixel painters";
    lifetime.title = "Lifetime wins";
    lifetime.id = "pixelPainters.wins";
    daily.title = "Daily wins";
    daily.id = "pixelPainters.wins";
    break;
  }

  case "mw": {
    mainTitle.innerHTML = "Mini walls";
    address.innerHTML = "<a href=\"https://discord.gg/a3mFVpMPaf\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "miniWalls.wins";
    daily.title = "Daily wins";
    daily.id = "miniWalls.wins";

    const mw1L = document.createElement("div");
    mw1L.setAttribute("class", "life");
    mw1L.title = "Lifetime kills";
    mw1L.id = "miniWalls.kills";
    main.appendChild(mw1L);

    const mw1D = document.createElement("div");
    mw1D.setAttribute("class", "day");
    mw1D.title = "Daily kills";
    mw1D.id = "miniWalls.kills";
    main.appendChild(mw1D);

    const mw2L = document.createElement("div");
    mw2L.setAttribute("class", "life");
    mw2L.title = "Lifetime deaths";
    mw2L.id = "miniWalls.deaths";
    main.appendChild(mw2L);

    const mw2D = document.createElement("div");
    mw2D.setAttribute("class", "day");
    mw2D.title = "Daily deaths";
    mw2D.id = "miniWalls.deaths";
    main.appendChild(mw2D);

    const mw3L = document.createElement("div");
    mw3L.setAttribute("class", "life");
    mw3L.title = "Lifetime final kills";
    mw3L.id = "miniWalls.finalKills";
    main.appendChild(mw3L);

    const mw3D = document.createElement("div");
    mw3D.setAttribute("class", "day");
    mw3D.title = "Daily final kills";
    mw3D.id = "miniWalls.finalKills";
    main.appendChild(mw3D);

    const mw4L = document.createElement("div");
    mw4L.setAttribute("class", "life");
    mw4L.title = "Lifetime wither kills";
    mw4L.id = "miniWalls.witherKills";
    main.appendChild(mw4L);

    const mw4D = document.createElement("div");
    mw4D.setAttribute("class", "day");
    mw4D.title = "Daily wither kills";
    mw4D.id = "miniWalls.witherKills";
    main.appendChild(mw4D);

    const mw5L = document.createElement("div");
    mw5L.setAttribute("class", "life");
    mw5L.title = "Lifetime wither damage";
    mw5L.id = "miniWalls.witherDamage";
    main.appendChild(mw5L);

    const mw5D = document.createElement("div");
    mw5D.setAttribute("class", "day");
    mw5D.title = "Daily wither damage";
    mw5D.id = "miniWalls.witherDamage";
    main.appendChild(mw5D);

    break;
  }

  case "seasonal": {
    mainTitle.innerHTML = "Seasonal Arcade games";
    address.innerHTML = "<a href=\"https://discord.gg/Nq6ytH7sBk\">Discord Invite</a>";
    lifetime.title = "Lifetime wins";
    lifetime.id = "seasonalWins.total";
    daily.title = "Daily wins";
    daily.id = "seasonalWins.total";

    const mw1L = document.createElement("div");
    mw1L.setAttribute("class", "life");
    mw1L.title = "Lifetime easter wins";
    mw1L.id = "seasonalWins.easter";
    main.appendChild(mw1L);

    const mw1D = document.createElement("div");
    mw1D.setAttribute("class", "day");
    mw1D.title = "Daily easter wins";
    mw1D.id = "seasonalWins.easter";
    main.appendChild(mw1D);

    const mw2L = document.createElement("div");
    mw2L.setAttribute("class", "life");
    mw2L.title = "Lifetime scuba wins";
    mw2L.id = "seasonalWins.scuba";
    main.appendChild(mw2L);

    const mw2D = document.createElement("div");
    mw2D.setAttribute("class", "day");
    mw2D.title = "Daily scuba wins";
    mw2D.id = "seasonalWins.scuba";
    main.appendChild(mw2D);

    const mw3L = document.createElement("div");
    mw3L.setAttribute("class", "life");
    mw3L.title = "Lifetime halloween wins";
    mw3L.id = "seasonalWins.halloween";
    main.appendChild(mw3L);

    const mw3D = document.createElement("div");
    mw3D.setAttribute("class", "day");
    mw3D.title = "Daily halloween wins";
    mw3D.id = "seasonalWins.halloween";
    main.appendChild(mw3D);

    const mw4L = document.createElement("div");
    mw4L.setAttribute("class", "life");
    mw4L.title = "Lifetime grinch wins";
    mw4L.id = "seasonalWins.grinch";
    main.appendChild(mw4L);

    const mw4D = document.createElement("div");
    mw4D.setAttribute("class", "day");
    mw4D.title = "Daily grinch wins";
    mw4D.id = "seasonalWins.grinch";
    main.appendChild(mw4D);

    break;
  }

  case "ctw": {
    mainTitle.innerHTML = "Capture the wool";
    address.innerHTML = "<a href=\"https://discord.gg/3B55bUcVKH\">Discord Invite</a>";
    lifetime.title = "Lifetime Wool";
    lifetime.id = "captureTheWool.woolCaptures";
    daily.title = "Daily wool";
    daily.id = "captureTheWool.woolCaptures";

    const killsL = document.createElement("div");
    killsL.setAttribute("class", "life");
    killsL.title = "Lifetime Kills";
    main.appendChild(killsL);

    const killsD = document.createElement("div");
    killsD.setAttribute("class", "day");
    killsD.title = "Daily kills";
    main.appendChild(killsD);

    killsD.id = "captureTheWool.kills";

    killsL.id = "captureTheWool.kills";
    break;
  }
  }

  const lifetimes = document.querySelectorAll(".life");
  for(const e of lifetimes) {
    e.innerHTML = "Loading...";
  }

  const days = document.querySelectorAll(".day");
  for(const e of days) {
    e.innerHTML = "Loading...";
  }

  await refresh();
  clearInterval(interval);
  interval = setInterval(refresh, 300000);
}

/**
 *
 */
async function refresh () {
  const time = document.querySelector("time");
  let servertime = await fetch("https://hyarcade.xyz/resources/timeupdate", {
    cache: "no-store"
  });
  servertime = await servertime.text();
  const formatted = new Date(servertime);
  time.innerHTML = `Last database update : ${formatted.toLocaleTimeString()}`;
  await handleLifetimes();
  await handleTimed("day");
}

/**
 *
 */
async function handleLifetimes () {
  const elements = document.querySelectorAll(".life");
  for(const e of elements) {
    await getLeaderboards(e);
  }
}

/**
 * 
 * @param {Element} element 
 */
async function getLeaderboards (element) {
  let lb = [];

  const id = element.getAttribute("id");
  const idArr = id.split(".");

  if (idArr.length > 1) {
    const category = idArr[0];
    const path = idArr[1];

    const url = `https://cdn.hyarcade.xyz/leaderboard?path=${path}&category=${category}&min`;
    console.info(`fetching ${url}`);
    const raw = await fetch(url);
    lb = await raw.json();
  } else {
    const path = idArr[0];

    const url = `https://cdn.hyarcade.xyz/leaderboard?path=${path}&min`;
    console.info(`fetching ${url}`);
    const raw = await fetch(url);
    lb = await raw.json();
  }

  let text = "";

  if (idArr.length > 1) {
    console.log(idArr);
    for(let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
      text += formatLine(lb[i].name, lb[i][idArr[0]][idArr[1]], lb[i].uuid, lb[i].rank, lb[i].plusColor);
    }
  } else {
    for(let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
      text += formatLine(lb[i].name, lb[i][idArr[0]], lb[i].uuid, lb[i].rank, lb[i].plusColor);
    }
  }

  element.innerHTML =
  `<h2>${ 
    element.getAttribute("title").replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;") 
  }</h2><ol>${ 
    text}</ol>`;

}

/**
 * @param {string} timetype
 */
async function handleTimed (timetype) {
  const elements = document.querySelectorAll(`.${timetype}`);
  for(const e of elements) {
    await getDaily(e, timetype);
  }
}

/**
 * 
 * @param {Element} element 
 * @param {string} timetype
 */
async function getDaily (element, timetype) {
  let lb = [];

  const id = element.getAttribute("id");
  const idArr = id.split(".");

  if (idArr.length > 1) {
    const category = idArr[0];
    const path = idArr[1];

    const url = `https://cdn.hyarcade.xyz/leaderboard?path=${path}&category=${category}&time=${timetype}&min`;
    console.info(`fetching ${url}`);
    const raw = await fetch(url);
    lb = await raw.json();
  } else {
    const path = idArr[0];

    const url = `https://cdn.hyarcade.xyz/leaderboard?path=${path}&time=${timetype}&min`;
    console.info(`fetching ${url}`);
    const raw = await fetch(url);
    lb = await raw.json();
  }

  let text = "";

  if (idArr.length > 1) {
    console.log(idArr);
    console.log(lb.length);
    for(let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
      text += formatLine(lb[i].name, lb[i]?.[idArr[0]]?.[idArr[1]], lb[i].uuid, lb[i].rank, lb[i].plusColor);
    }
  } else {
    for(let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
      text += formatLine(lb[i].name, lb[i][idArr[0]], lb[i].uuid, lb[i].rank, lb[i].plusColor);
    }
  }

  element.innerHTML =
        `<h2>${ 
          element.getAttribute("title").replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;") 
        }</h2><ol>${ 
          text}</ol>`;
}

/**
 * @param {string} name
 * @param {string} value
 * @param {string} uuid
 * @param {string} rank
 * @param {string} plusColor
 * @returns {string}
 */
function formatLine (name, value, uuid, rank, plusColor) {
  let longName = `${name}`;
  longName = `<a href="player.html?q=${uuid}"><img src="https://crafatar.com/avatars/${uuid}?overlay" height="24" /> ${formatRank(rank, plusColor)}${longName}</a>`;
  if(value > 0) {
    return `<li>${longName} <i>${formatNum(value)}</i></li>`;
  } 
  return "";
}

/**
 * 
 * @param {string} rank 
 * @param {string} plusColor 
 * @returns {string}
 */
function formatRank (rank, plusColor) {
  let betterRank = `${rank}`.replace(/_PLUS/g, "+");

  if(betterRank == "MVP++") {
    betterRank = `<b class="gold">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="gold">]</b> `;
  } else if(betterRank == "MVP+" || betterRank == "MVP") {
    betterRank = `<b class="aqua">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="aqua">]</b> `;
  } else if(betterRank == "VIP+" || betterRank == "VIP") {
    betterRank = `<b class="green">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="green">]</b> `;
  } else {
    betterRank = "";
  }

  return betterRank;
}

/**
 * @param {number} number
 * @returns {string}
 */
function formatNum (number) {
  const str = new Number(number);
  if(number == undefined) {
    return new Number(0).toLocaleString();
  } 
  return str.toLocaleString();
    
}

window.addEventListener("load", load);
