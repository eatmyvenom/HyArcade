/* eslint-disable no-use-before-define */
let maxLength = 25;
let interval;

/**
 * @param {number} number
 * @returns {string}
 */
function formatNum(number) {
  const str = Number(number);
  if (number == undefined) {
    return Number(0).toLocaleString();
  }
  return str.toLocaleString();
}

/**
 *
 */
async function handleLbs() {
  const elements = document.querySelectorAll("main div");
  for (const e of elements) {
    await getLeaderboards(e);
  }
}

/**
 *
 */
async function refresh() {
  handleLbs().then(console.log).catch(console.error);

  const time = document.querySelector("time");

  if (localStorage.getItem("timeout") == undefined) {
    localStorage.setItem("timeout", Date.now());
  } else if (Date.now() - localStorage.getItem("timeout") > 86400000) {
    localStorage.clear();
    localStorage.setItem("timeout", Date.now());
  }

  let servertime = await fetch("https://hyarcade.xyz/resources/timeupdate", {
    cache: "no-store",
    mode: "cors",
  });

  showCounts().then(console.log).catch(console.error);

  servertime = await servertime.text();
  const formatted = new Date(servertime);
  time.innerHTML = `Last database update : ${formatted.toLocaleTimeString()}`;
}

/**
 *
 */
async function load() {
  let game = window.location.pathname;
  game = game.slice(Math.max(0, game.lastIndexOf("/") + 1));

  const guildpage = document.querySelector(".guildver");
  guildpage.setAttribute("href", `./guilds/${game}`);

  const main = document.querySelector("main");
  const mainTitle = document.querySelector("h1");
  const address = document.querySelector("address");

  const mainStat = document.createElement("div");

  main.append(mainStat);

  switch (game) {
    case "partygames": {
      mainTitle.innerHTML = "Party Games";
      address.innerHTML = '<a href="https://discord.gg/kVSdPevCwm">Discord Invite</a>';
      mainStat.title += "Wins";
      mainStat.id = "partyGames.wins";

      const stars = document.createElement("div");
      stars.title = "Stars";
      stars.id = "partyGames.starsEarned";
      main.append(stars);

      const rounds = document.createElement("div");
      rounds.title = "Rounds Won";
      rounds.id = "partyGames.roundsWon";
      main.append(rounds);

      break;
    }

    case "hypixelsays": {
      mainTitle.innerHTML = "Hypixel Says";
      address.innerHTML = '<a href="https://discord.gg/GzjN5c4zze">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "hypixelSays.wins";

      const rounds = document.createElement("div");
      rounds.title = "Points";
      rounds.id = "hypixelSays.totalPoints";
      main.append(rounds);

      break;
    }

    case "farmhunt": {
      mainTitle.innerHTML = "Farm Hunt";
      address.innerHTML = '<a href="https://discord.gg/fVgcvhtaWk">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "farmhunt.wins";

      const kills = document.createElement("div");
      kills.title = "Kills";
      kills.id = "farmhunt.kills";
      main.append(kills);

      const animalWins = document.createElement("div");
      animalWins.title = "Animal Wins";
      animalWins.id = "farmhunt.animalWins";
      main.append(animalWins);

      const hunterWins = document.createElement("div");
      hunterWins.title = "Hunter Wins";
      hunterWins.id = "farmhunt.hunterWins";
      main.append(hunterWins);

      break;
    }

    case "holeinthewall": {
      mainTitle.innerHTML = "Hole in the Wall";
      address.innerHTML = '<a href="https://discord.gg/Gh24vw5b54">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "holeInTheWall.wins";

      const walls = document.createElement("div");
      walls.title = "Walls";
      walls.id = "holeInTheWall.rounds";
      main.append(walls);

      const qual = document.createElement("div");
      qual.title = "Qualifiers PB";
      qual.id = "holeInTheWall.qualifiers";
      main.append(qual);

      const final = document.createElement("div");
      final.title = "Finals PB";
      final.id = "holeInTheWall.finals";
      main.append(final);

      break;
    }

    case "football": {
      mainTitle.innerHTML = "Football";
      address.innerHTML = '<a href="https://discord.gg/P5c5RSG2yF">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "football.wins";

      const goals = document.createElement("div");
      goals.title = "Goals";
      main.append(goals);

      goals.id = "football.goals";

      break;
    }

    case "enderspleef": {
      mainTitle.innerHTML = "Ender Spleef";
      address.innerHTML = '<a href="https://discord.gg/9xRhumdEyq">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "enderSpleef.wins";

      const blocks = document.createElement("div");
      blocks.title = "Blocks Broken";
      blocks.id = "enderSpleef.blocksBroken";
      main.append(blocks);
      break;
    }

    case "throwout": {
      mainTitle.innerHTML = "Throw Out";
      address.innerHTML = '<a href="https://discord.gg/2sMpvqtJYh">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "throwOut.wins";

      const kills = document.createElement("div");
      kills.title = "Kills";
      kills.id = "throwOut.kills";
      main.append(kills);

      const deaths = document.createElement("div");
      deaths.title = "Deaths";
      deaths.id = "throwOut.deaths";
      main.append(deaths);

      break;
    }

    case "galaxywars": {
      mainTitle.innerHTML = "Galaxy Wars";
      address.innerHTML = '<a href="https://discord.gg/v9ZwqyZfYj">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "galaxyWars.wins";

      const kills = document.createElement("div");
      kills.title = "Kills";
      main.append(kills);

      kills.id = "galaxyWars.kills";

      const death = document.createElement("div");
      death.title = "Deaths";
      main.append(death);

      death.id = "galaxyWars.deaths";
      break;
    }

    case "dragonwars": {
      mainTitle.innerHTML = "Dragon Wars";
      address.innerHTML = '<a href="https://discord.gg/7ccREnQVuU">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "dragonWars.wins";

      const kills = document.createElement("div");
      kills.title = "Kills";
      kills.id = "dragonWars.kills";
      main.append(kills);

      break;
    }

    case "bountyhunters": {
      mainTitle.innerHTML = "Bounty Hunters";
      address.innerHTML = "";
      mainStat.title = "Wins";

      mainStat.id = "bountyHunters.wins";

      const killsL = document.createElement("div");
      killsL.title = "Kills";
      killsL.id = "bountyHunters.kills";
      main.append(killsL);
      break;
    }

    case "blockingdead": {
      mainTitle.innerHTML = "Blocking Dead";
      address.innerHTML = '<a href="https://discord.gg/MkGKhztYcZ">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "blockingDead.wins";

      const kills = document.createElement("div");
      kills.title = "Kills";
      kills.id = "blockingDead.kills";
      main.append(kills);

      const headshot = document.createElement("div");
      headshot.title = "Headshots";
      headshot.id = "blockingDead.headshots";
      main.append(headshot);

      break;
    }

    case "hideandseek": {
      mainTitle.innerHTML = "Hide and Seek";
      address.innerHTML = '<a href="https://discord.gg/MkGKhztYcZ">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "hideAndSeek.wins";

      const seekerL = document.createElement("div");
      seekerL.title = "Seeker Wins";
      seekerL.id = "hideAndSeek.seekerWins";
      main.append(seekerL);

      const hiderL = document.createElement("div");
      hiderL.title = "Hider Wins";
      hiderL.id = "hideAndSeek.hiderWins";
      main.append(hiderL);

      const hiderKL = document.createElement("div");
      hiderKL.title = "Kills";
      hiderKL.id = "hideAndSeek.kills";
      main.append(hiderKL);

      break;
    }

    case "arcade": {
      mainTitle.innerHTML = "Arcade Overall";
      address.innerHTML = '<a href="https://discord.gg/J6UMkQrjpV">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "arcadeWins";

      const combinedWinsL = document.createElement("div");
      combinedWinsL.title = "Combined wins";
      combinedWinsL.id = "combinedArcadeWins";
      main.append(combinedWinsL);

      const coins = document.createElement("div");
      coins.title = "Coins";
      coins.id = "arcadeCoins";
      main.append(coins);

      break;
    }

    case "zombies": {
      mainTitle.innerHTML = "Zombies";
      address.innerHTML = '<a href="https://discord.gg/2RDCTPWqVT">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "zombies.wins_zombies";

      const deWinsL = document.createElement("div");
      deWinsL.title = "Dead End wins";
      deWinsL.id = "zombies.wins_zombies_deadend";
      main.append(deWinsL);

      const bbWinsL = document.createElement("div");
      bbWinsL.title = "Bad Blood wins";
      bbWinsL.id = "zombies.wins_zombies_badblood";
      main.append(bbWinsL);

      const aaWinsL = document.createElement("div");
      aaWinsL.title = "Alien wins";
      aaWinsL.id = "zombies.wins_zombies_alienarcadium";
      main.append(aaWinsL);

      break;
    }

    case "pixelpainters": {
      mainTitle.innerHTML = "Pixel Painters";
      mainStat.title = "Wins";
      mainStat.id = "pixelPainters.wins";
      break;
    }

    case "miniwalls": {
      mainTitle.innerHTML = "Mini Walls";
      address.innerHTML = '<a href="https://discord.gg/a3mFVpMPaf">Discord Invite</a>';
      mainStat.title = "Wins";
      mainStat.id = "miniWalls.wins";

      const kills = document.createElement("div");
      kills.title = "Kills";
      kills.id = "miniWalls.kills";
      main.append(kills);

      const finals = document.createElement("div");
      finals.title = "Final kills";
      finals.id = "miniWalls.finalKills";
      main.append(finals);

      const witherDmg = document.createElement("div");
      witherDmg.title = "Wither damage";
      witherDmg.id = "miniWalls.witherDamage";
      main.append(witherDmg);

      break;
    }

    case "seasonal": {
      mainTitle.innerHTML = "Seasonal Arcade Games";
      address.innerHTML = '<a href="https://discord.gg/Nq6ytH7sBk">Discord Invite</a>';
      mainStat.title = "Total Wins";
      mainStat.id = "seasonalWins.total";

      const gsim = document.createElement("div");
      gsim.title = "Grinch Wins";
      gsim.id = "seasonalWins.grinch";
      main.append(gsim);

      break;
    }

    case "capturethewool": {
      mainTitle.innerHTML = "Capture the Wool";
      address.innerHTML = '<a href="https://discord.gg/3B55bUcVKH">Discord Invite</a>';
      mainStat.title = "Wool Captures";
      mainStat.id = "captureTheWool.woolCaptures";

      const killsL = document.createElement("div");
      killsL.title = "Kills";
      killsL.id = "captureTheWool.kills";
      main.append(killsL);

      break;
    }
  }

  const lifetimes = document.querySelectorAll(".life");
  for (const e of lifetimes) {
    e.setAttribute("vis", false);
    e.innerHTML =
      '<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  }

  const days = document.querySelectorAll(".day");
  for (const e of days) {
    e.setAttribute("vis", false);
    e.innerHTML =
      '<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  }

  await refresh();
  clearInterval(interval);
  interval = setInterval(refresh, 900000);
}

/**
 *
 */
async function showCounts() {
  let game = window.location.pathname;
  game = game.slice(Math.max(0, game.lastIndexOf("/") + 1));

  const info = document.querySelector("#info");

  let counts = await fetch("https://api.slothpixel.me/api/counts", { cache: "no-store", mode: "cors" });
  let rawData = await counts.text();

  try {
    counts = JSON.parse(rawData);
  } catch (error) {
    console.error(error);
    console.log(rawData);
  }

  const arcade = counts.games.ARCADE.modes;

  info.innerHTML = "Current Players: ";

  switch (game) {
    case "partygames": {
      info.innerHTML += formatNum(arcade.PARTY?.players ?? 0);
      break;
    }

    case "hypixelsays": {
      info.innerHTML += formatNum(arcade.SANTA_SAYS?.players ?? 0);
      break;
    }

    case "farmhunt": {
      info.innerHTML += formatNum(arcade.FARM_HUNT?.players ?? 0);
      break;
    }

    case "holeinthewall": {
      info.innerHTML += formatNum(arcade.HOLE_IN_THE_WALL?.players ?? 0);
      break;
    }

    case "football": {
      info.innerHTML += formatNum(arcade.SOCCER?.players ?? 0);
      break;
    }

    case "enderspleef": {
      info.innerHTML += formatNum(arcade.ENDER?.players ?? 0);
      break;
    }

    case "throwout": {
      info.innerHTML += formatNum(arcade.THROW_OUT?.players ?? 0);
      break;
    }

    case "galaxywars": {
      info.innerHTML += formatNum(arcade.STARWARS?.players ?? 0);
      break;
    }

    case "dragonwars": {
      info.innerHTML += formatNum(arcade.DRAGONWARS2?.players ?? 0);
      break;
    }

    case "bountyhunters": {
      info.innerHTML += formatNum(arcade.ONEINTHEQUIVER?.players ?? 0);
      break;
    }

    case "blockingdead": {
      info.innerHTML += formatNum(arcade.DAYONE?.players ?? 0);
      break;
    }

    case "hideandseek": {
      info.innerHTML += formatNum((arcade.HIDE_AND_SEEK_PROP_HUNT?.players ?? 0) + (arcade.HIDE_AND_SEEK_PARTY_POOPER?.players ?? 0));
      break;
    }

    case "arcade": {
      info.innerHTML += formatNum(counts.games.ARCADE?.players ?? 0);
      break;
    }

    case "zombies": {
      info.innerHTML += formatNum((arcade.ZOMBIES_ALIEN_ARCADIUM?.players ?? 0) + (arcade.ZOMBIES_BAD_BLOOD?.players ?? 0) + (arcade.ZOMBIES_DEAD_END?.players ?? 0));
      break;
    }

    case "pixelpainters": {
      info.innerHTML += formatNum(arcade.DRAW_THEIR_THING?.players ?? 0);
      break;
    }

    case "miniwalls": {
      info.innerHTML += formatNum(arcade.MINI_WALLS?.players ?? 0);
      break;
    }

    case "seasonal": {
      info.innerHTML += formatNum(arcade.GRINCH_SIMULATOR_V2?.players ?? 0);
      break;
    }

    case "capturethewool": {
      info.innerHTML += formatNum(arcade.PVP_CTW?.players ?? 0);
      break;
    }
  }
  info.innerHTML += `<br />Total Players: ${formatNum(counts.playerCount ?? 0)}`;
}

/**
 *
 * @param {Element} element
 */
async function getLeaderboards(element) {
  let lb = [];

  const id = element.getAttribute("id");
  const idArr = id.split(".");

  const time = document.querySelector("[selected]").id;

  let formattedTime;

  formattedTime = time == "lifetime" ? "" : `&time=${time}`;

  if (idArr.length > 1) {
    const category = idArr[0];
    const path = idArr[1];
    const args = `path=${path}&category=${category}${formattedTime}&max=${maxLength}`;

    if (localStorage.getItem(args) != undefined && Date.now() - JSON.parse(localStorage.getItem(args)).time < 600000) {
      lb = JSON.parse(localStorage.getItem(args)).lb;
    } else {
      const url = `https://api.hyarcade.xyz/leaderboard?${args}&min`;
      console.info(`fetching ${url}`);
      const raw = await fetch(url, { mode: "cors" });
      lb = await raw.json();
      localStorage.setItem(args, JSON.stringify({ lb, time: Date.now() }));
    }
  } else {
    const path = idArr[0];
    const args = `path=${path}${formattedTime}&max=${maxLength}`;

    if (localStorage.getItem(args) != undefined && Date.now() - JSON.parse(localStorage.getItem(args)).time < 600000) {
      lb = JSON.parse(localStorage.getItem(args)).lb;
    } else {
      const url = `https://api.hyarcade.xyz/leaderboard?${args}&min`;
      console.info(`fetching ${url}`);
      const raw = await fetch(url, { mode: "cors" });
      lb = await raw.json();
      localStorage.setItem(args, JSON.stringify({ lb, time: Date.now() }));
    }
  }

  let text = "";

  if (formattedTime == "") {
    if (idArr.length > 1) {
      for (let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
        text += formatLine(lb[i].name, lb[i][idArr[0]][idArr[1]], lb[i].uuid, lb[i].rank, lb[i].plusColor, lb[i].mvpColor);
      }
    } else {
      for (let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
        text += formatLine(lb[i].name, lb[i][idArr[0]], lb[i].uuid, lb[i].rank, lb[i].plusColor, lb[i].mvpColor);
      }
    }
  } else {
    for (let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
      text += formatLine(lb[i].name, lb[i]?.lbProp ?? 0, lb[i].uuid, lb[i].rank, lb[i].plusColor, lb[i].mvpColor);
    }
  }

  const txtTime = document.querySelector("[selected]").textContent;

  element.innerHTML = `<h2 class="minecraft">${txtTime} ${element
    .getAttribute("title")
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")}</h2><ol>${text.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;")}</ol>`;
  element.setAttribute("vis", true);
}

/**
 * @param {string} name
 * @param {string} value
 * @param {string} uuid
 * @param {string} rank
 * @param {string} plusColor
 * @param {string} rankColor
 * @returns {string}
 */
function formatLine(name, value, uuid, rank, plusColor, rankColor) {
  let longName = `${name}`;
  longName = `<a href="player.html?q=${uuid}" class="minecraft"><img src="https://crafatar.com/avatars/${uuid}?overlay" height="24" /> ${formatRank(
    rank,
    plusColor,
    longName,
    rankColor,
  )}</a>`;
  if (value > 0) {
    return `<li>${longName} <i class="minecraft">${formatNum(value)}</i></li>`;
  }
  return "";
}

/**
 *
 * @param {string} rank
 * @param {string} plusColor
 * @param {string} name
 * @param {string} mvpColor
 * @returns {string}
 */
function formatRank(rank, plusColor, name = "", mvpColor = "GOLD") {
  let betterRank = `${rank}`.replace(/_PLUS/g, "+");

  if (name != "") {
    // eslint-disable-next-line no-param-reassign
    name = ` ${name}`;
  }

  if (betterRank == "MVP++") {
    betterRank = `<b class="${mvpColor.toLowerCase()}">[${betterRank.replace(
      /\+/g,
      `<b class="${plusColor.toLowerCase()}">+</b>`,
    )}</b><b class="${mvpColor.toLowerCase()}">]${name}</b>`;
  } else if (betterRank == "MVP+" || betterRank == "MVP") {
    betterRank = `<b class="aqua">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="aqua">]${name}</b>`;
  } else if (betterRank == "VIP+" || betterRank == "VIP") {
    betterRank = `<b class="green">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="green">]${name}</b>`;
  } else if (betterRank == "YOUTUBER") {
    betterRank = `<b class="red">[</b><b class="white">YOUTUBE</b><b class="red">]${name}</b>`;
  } else if (betterRank == "ADMIN") {
    betterRank = `<b class="red">[ADMIN]${name}</b>`;
  } else {
    betterRank = `<b class="gray">${name}</b>`;
  }

  return betterRank;
}

/**
 * @param val
 */
// eslint-disable-next-line no-unused-vars
function maxValChange(val) {
  maxLength = val;
  refresh().then(console.log).catch(console.error);
}

/**
 * @param btn
 */
// eslint-disable-next-line no-unused-vars
function btnClick(btn) {
  for (const e of document.querySelectorAll("nav button")) e.removeAttribute("selected");

  btn.setAttribute("selected", "");

  refresh().then(console.log).catch(console.error);
}

window.addEventListener("load", load);
