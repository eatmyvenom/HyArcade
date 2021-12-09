let maxLength = 25;
let interval;


// eslint-disable-next-line
function maxValChange (val) {
  maxLength = val;
  refresh()
    .then(console.log)
    .catch(console.error);
}

// eslint-disable-next-line
function btnClick (btn) {
  document.querySelectorAll("nav button").forEach((e) => e.removeAttribute("selected"));

  console.log(btn);
  btn.setAttribute("selected", "");

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

  const mainStat = document.createElement("div");

  main.appendChild(mainStat);

  switch(game) {
  case "pg": {
    mainTitle.innerHTML = "Party games";
    address.innerHTML = "<a href=\"https://discord.gg/kVSdPevCwm\">Discord Invite</a>";
    mainStat.title += "Wins";
    mainStat.id = "partyGames.wins";

    const stars = document.createElement("div");
    stars.title = "Stars";
    stars.id = "partyGames.starsEarned";
    main.appendChild(stars);

    const rounds = document.createElement("div");
    rounds.title = "Rounds Won";
    rounds.id = "partyGames.roundsWon";
    main.appendChild(rounds);

    break;
  }

  case "hs": {
    mainTitle.innerHTML = "Hypixel Says";
    address.innerHTML = "<a href=\"https://discord.gg/GzjN5c4zze\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "hypixelSays.wins";

    const rounds = document.createElement("div");
    rounds.title = "Points";
    rounds.id = "hypixelSays.rounds";
    main.appendChild(rounds);

    break;
  }

  case "fh": {
    mainTitle.innerHTML = "Farm hunt";
    address.innerHTML = "<a href=\"https://discord.gg/fVgcvhtaWk\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "farmhunt.wins";

    const shit = document.createElement("div");
    shit.title = "Poop";
    shit.id = "farmhunt.poop";
    main.appendChild(shit);

    break;
  }

  case "hitw": {
    mainTitle.innerHTML = "Hole in the wall";
    address.innerHTML = "<a href=\"https://discord.gg/Gh24vw5b54\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "holeInTheWall.wins";

    const walls = document.createElement("div");
    walls.setAttribute("class", "life");
    walls.title = "Lifetime walls";
    walls.id = "holeInTheWall.rounds";
    main.appendChild(walls);

    const qual = document.createElement("div");
    qual.setAttribute("class", "life");
    qual.title = "Qualifiers PB";
    qual.id = "holeInTheWall.qualifiers";
    main.appendChild(qual);

    const final = document.createElement("div");
    final.setAttribute("class", "life");
    final.title = "Finals PB";
    final.id = "holeInTheWall.finals";
    main.appendChild(final);

    break;
  }

  case "fb": {
    mainTitle.innerHTML = "Football";
    address.innerHTML = "<a href=\"https://discord.gg/P5c5RSG2yF\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "football.wins";

    const goals = document.createElement("div");
    goals.setAttribute("class", "life");
    goals.title = "Goals";
    main.appendChild(goals);

    goals.id = "football.goals";

    break;
  }

  case "es": {
    mainTitle.innerHTML = "Ender spleef";
    address.innerHTML = "<a href=\"https://discord.gg/9xRhumdEyq\">Discord Invite</a>";
    mainStat.title = "Lifetime wins";
    mainStat.id = "enderSpleef.wins";
    break;
  }

  case "to": {
    mainTitle.innerHTML = "Throw out";
    address.innerHTML = "<a href=\"https://discord.gg/2sMpvqtJYh\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "throwOut.wins";

    const kills = document.createElement("div");
    kills.title = "Kills";
    kills.id = "throwOut.kills";
    main.appendChild(kills);


    const deaths = document.createElement("div");
    deaths.title = "Deaths";
    deaths.id = "throwOut.deaths";
    main.appendChild(deaths);

    break;
  }

  case "gw": {
    mainTitle.innerHTML = "Galaxy Wars";
    address.innerHTML = "<a href=\"https://discord.gg/v9ZwqyZfYj\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "galaxyWars.wins";

    const kills = document.createElement("div");
    kills.title = "Kills";
    main.appendChild(kills);

    kills.id = "galaxyWars.kills";

    const death = document.createElement("div");
    death.title = "Deaths";
    main.appendChild(death);

    death.id = "galaxyWars.deaths";
    break;
  }

  case "dw": {
    mainTitle.innerHTML = "Dragon Wars";
    address.innerHTML = "<a href=\"https://discord.gg/7ccREnQVuU\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "dragonWars.wins";

    const kills = document.createElement("div");
    kills.title = "Kills";
    kills.id = "dragonWars.kills";
    main.appendChild(kills);

    break;
  }

  case "bh": {
    mainTitle.innerHTML = "Bounty Hunters";
    address.innerHTML = "";
    mainStat.title = "Wins";

    mainStat.id = "bountyHunters.wins";

    const killsL = document.createElement("div");
    killsL.title = "Kills";
    killsL.id = "bountyHunters.kills";
    main.appendChild(killsL);
    break;
  }

  case "bd": {
    mainTitle.innerHTML = "Blocking Dead";
    address.innerHTML = "<a href=\"https://discord.gg/MkGKhztYcZ\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "blockingDead.wins";

    const kills = document.createElement("div");
    kills.title = "Kills";
    kills.id = "blockingDead.kills";
    main.appendChild(kills);

    const headshot = document.createElement("div");
    headshot.title = "Headshots";
    headshot.id = "blockingDead.headshots";
    main.appendChild(headshot);

    break;
  }

  case "hns": {
    mainTitle.innerHTML = "Hide and Seek";
    address.innerHTML = "<a href=\"https://discord.gg/MkGKhztYcZ\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "hideAndSeek.wins";

    const seekerL = document.createElement("div");
    seekerL.title = "Seeker wins";
    seekerL.id = "hideAndSeek.seekerWins";
    main.appendChild(seekerL);

    const hiderL = document.createElement("div");
    hiderL.id = "hideAndSeek.hiderWins";
    hiderL.title = "Hider wins";
    main.appendChild(hiderL);

    const hiderKL = document.createElement("div");
    hiderKL.id = "hideAndSeek.kills";
    hiderKL.title = "Kills";
    main.appendChild(hiderKL);

    break;
  }

  case "arc": {
    mainTitle.innerHTML = "Arcade overall";
    address.innerHTML = "<a href=\"https://discord.gg/J6UMkQrjpV\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "arcadeWins";

    const combinedWinsL = document.createElement("div");
    combinedWinsL.title = "Combined wins";
    combinedWinsL.id = "combinedArcadeWins";
    main.appendChild(combinedWinsL);


    const coins = document.createElement("div");
    coins.title = "Coins";
    coins.id = "arcadeCoins";
    main.appendChild(coins);

    break;
  }

  case "z": {
    mainTitle.innerHTML = "Zombies";
    address.innerHTML = "<a href=\"https://discord.gg/2RDCTPWqVT\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "zombies.wins_zombies";

    const deWinsL = document.createElement("div");
    deWinsL.title = "Dead End wins";
    deWinsL.id = "zombies.wins_zombies_deadend";
    main.appendChild(deWinsL);

    const bbWinsL = document.createElement("div");
    bbWinsL.title = "Bad Blood wins";
    bbWinsL.id = "zombies.wins_zombies_badblood";
    main.appendChild(bbWinsL);

    const aaWinsL = document.createElement("div");
    aaWinsL.title = "Alien wins";
    aaWinsL.id = "zombies.wins_zombies_alienarcadium";
    main.appendChild(aaWinsL);
    
    break;
  }

  case "pp": {
    mainTitle.innerHTML = "Pixel painters";
    mainStat.title = "Wins";
    mainStat.id = "pixelPainters.wins";
    break;
  }

  case "mw": {
    mainTitle.innerHTML = "Mini walls";
    address.innerHTML = "<a href=\"https://discord.gg/a3mFVpMPaf\">Discord Invite</a>";
    mainStat.title = "Wins";
    mainStat.id = "miniWalls.wins";

    const kills = document.createElement("div");
    kills.title = "Kills";
    kills.id = "miniWalls.kills";
    main.appendChild(kills);

    const finals = document.createElement("div");
    finals.title = "Final kills";
    finals.id = "miniWalls.finalKills";
    main.appendChild(finals);

    const witherDmg = document.createElement("div");
    witherDmg.title = "Wither damage";
    witherDmg.id = "miniWalls.witherDamage";
    main.appendChild(witherDmg);

    break;
  }

  case "seasonal": {
    mainTitle.innerHTML = "Seasonal Arcade games";
    address.innerHTML = "<a href=\"https://discord.gg/Nq6ytH7sBk\">Discord Invite</a>";
    mainStat.title = "Lifetime wins";
    mainStat.id = "seasonalWins.total";

    const esim = document.createElement("div");
    esim.title = "Easter wins";
    esim.id = "seasonalWins.easter";
    main.appendChild(esim);

    const hsim = document.createElement("div");
    hsim.title = "Halloween wins";
    hsim.id = "seasonalWins.halloween";
    main.appendChild(hsim);

    const gsim = document.createElement("div");
    gsim.setAttribute("class", "life");
    gsim.title = "Grinch wins";
    gsim.id = "seasonalWins.grinch";
    main.appendChild(gsim);

    break;
  }

  case "ctw": {
    mainTitle.innerHTML = "Capture the wool";
    address.innerHTML = "<a href=\"https://discord.gg/3B55bUcVKH\">Discord Invite</a>";
    mainStat.title = "Wool Captures";
    mainStat.id = "captureTheWool.woolCaptures";

    const killsL = document.createElement("div");
    killsL.title = "Kills";
    killsL.id = "captureTheWool.kills";
    main.appendChild(killsL);

    break;
  }
  }

  const lifetimes = document.querySelectorAll(".life");
  for(const e of lifetimes) {
    e.setAttribute("vis", false);
    e.innerHTML = "<div class=\"lds-default\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
  }

  const days = document.querySelectorAll(".day");
  for(const e of days) {
    e.setAttribute("vis", false);
    e.innerHTML = "<div class=\"lds-default\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>";
  }

  await refresh();
  clearInterval(interval);
  interval = setInterval(refresh, 900000);
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
  handleLbs()
    .then(console.log)
    .catch(console.error);
}

/**
 *
 */
async function handleLbs () {
  const elements = document.querySelectorAll("main div");
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

  const time = document.querySelector("[selected]").id;

  let formattedTime;

  if(time == "lifetime") {
    formattedTime = "";
  } else {
    formattedTime = `&time=${time}`;
  }

  if (idArr.length > 1) {
    const category = idArr[0];
    const path = idArr[1];

    const url = `https://cdn.hyarcade.xyz/leaderboard?path=${path}&category=${category}${formattedTime}&min&max=${maxLength}`;
    console.info(`fetching ${url}`);
    const raw = await fetch(url);
    lb = await raw.json();
  } else {
    const path = idArr[0];

    const url = `https://cdn.hyarcade.xyz/leaderboard?path=${path}${formattedTime}&min&max=${maxLength}`;
    console.info(`fetching ${url}`);
    const raw = await fetch(url);
    lb = await raw.json();
  }

  let text = "";

  if(formattedTime == "") {
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
  } else {
    for(let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
      text += formatLine(lb[i].name, lb[i]?.lbProp ?? 0, lb[i].uuid, lb[i].rank, lb[i].plusColor);
    }
  }


  const txtTime = document.querySelector("[selected]").innerText;

  element.innerHTML =
  `<h2>${txtTime} ${ 
    element.getAttribute("title").replace(/&/g, "&amp;")
      .replace(/>/g, "&gt;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;") 
  }</h2><ol>${ 
    text}</ol>`;
  element.setAttribute("vis", true);
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
