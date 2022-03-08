/* eslint-disable jsdoc/require-returns */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
const maxLength = 25;

/**
 *
 */
async function load() {
  let game = window.location.pathname;
  game = game.slice(Math.max(0, game.lastIndexOf("/") + 1));
  const main = document.querySelector("main");
  const mainTitle = document.querySelector("h1");
  const address = document.querySelector("address");

  const lifetime = document.createElement("div");
  lifetime.setAttribute("class", "life");

  main.append(lifetime);

  switch (game) {
    case "partygames": {
      mainTitle.innerHTML = "Party games";
      address.innerHTML = '<a href="https://discord.gg/kVSdPevCwm">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "partyGamesWins";
      break;
    }

    case "hypixelsays": {
      mainTitle.innerHTML = "Hypixel Says";
      address.innerHTML = '<a href="https://discord.gg/GzjN5c4zze">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "hypixelSaysWins";
      break;
    }

    case "farmhunt": {
      mainTitle.innerHTML = "Farm hunt";
      address.innerHTML = '<a href="https://discord.gg/fVgcvhtaWk">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "farmhuntWins";
      break;
    }

    case "holeinthewall": {
      mainTitle.innerHTML = "Hole in the wall";
      address.innerHTML = '<a href="https://discord.gg/Gh24vw5b54">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "hitwWins";
      break;
    }

    case "football": {
      mainTitle.innerHTML = "Football";
      address.innerHTML = '<a href="https://discord.gg/P5c5RSG2yF">Discord Invite</a>';
      lifetime.title = "Lifetime wins";

      lifetime.id = "footballWins";
      break;
    }

    case "enderspleef": {
      mainTitle.innerHTML = "Ender spleef";
      address.innerHTML = '<a href="https://discord.gg/9xRhumdEyq">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "enderSpleefWins";
      break;
    }

    case "throwout": {
      mainTitle.innerHTML = "Throw out";
      address.innerHTML = '<a href="https://discord.gg/2sMpvqtJYh">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "throwOutWins";
      break;
    }

    case "galaxywars": {
      mainTitle.innerHTML = "Galaxy Wars";
      address.innerHTML = '<a href="https://discord.gg/v9ZwqyZfYj">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "galaxyWarsWins";
      break;
    }

    case "dragonwars": {
      mainTitle.innerHTML = "Dragon Wars";
      address.innerHTML = '<a href="https://discord.gg/7ccREnQVuU">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "dragonWarsWins";
      break;
    }

    case "bountyhunters": {
      mainTitle.innerHTML = "Bounty Hunters";
      address.innerHTML = "";
      lifetime.title = "Lifetime wins";
      lifetime.id = "bountyHuntersWins";
      break;
    }

    case "blockingdead": {
      mainTitle.innerHTML = "Blocking Dead";
      address.innerHTML = '<a href="https://discord.gg/MkGKhztYcZ">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "blockingDeadWins";
      break;
    }

    case "hideandseek": {
      mainTitle.innerHTML = "Hide and Seek";
      address.innerHTML = '<a href="https://discord.gg/MkGKhztYcZ">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "hideAndSeekWins";
      break;
    }

    case "arcade": {
      mainTitle.innerHTML = "Arcade overall";
      address.innerHTML = '<a href="https://discord.gg/J6UMkQrjpV">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "arcadeWins";

      const killsL = document.createElement("div");
      killsL.setAttribute("class", "life");
      killsL.title = "Lifetime coins";
      main.append(killsL);

      killsL.id = "arcadeCoins";

      const agxpL = document.createElement("div");
      agxpL.setAttribute("class", "life");
      agxpL.title = "Lifetime arcade GXP";
      main.append(agxpL);

      agxpL.id = "arcadeEXP";

      const gxpL = document.createElement("div");
      gxpL.setAttribute("class", "life");
      gxpL.title = "Lifetime GXP";
      main.append(gxpL);

      gxpL.id = "gexp";
      break;
    }

    case "zombies": {
      mainTitle.innerHTML = "Zombies";
      address.innerHTML = '<a href="https://discord.gg/2RDCTPWqVT">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "zombiesWins";
      break;
    }

    case "pixelpainters": {
      mainTitle.innerHTML = "Pixel painters";
      lifetime.title = "Lifetime wins";
      lifetime.id = "pixelPaintersWins";
      break;
    }

    case "miniwalls": {
      mainTitle.innerHTML = "Mini walls";
      address.innerHTML = '<a href="https://discord.gg/a3mFVpMPaf">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "miniWallsWins";
      break;
    }

    case "seasonal": {
      mainTitle.innerHTML = "Seasonal Arcade games";
      address.innerHTML = '<a href="https://discord.gg/Nq6ytH7sBk">Discord Invite</a>';
      lifetime.title = "Lifetime wins";
      lifetime.id = "simWins";
      break;
    }
  }

  mainTitle.innerHTML += " guilds";

  const lifetimes = document.querySelectorAll(".life");
  for (const e of lifetimes) {
    e.innerHTML = "Loading...";
  }

  await refresh();
  setInterval(refresh, 25000);
}

/**
 *
 */
async function refresh() {
  await handleLifetimes();
}

/**
 *
 */
async function handleLifetimes() {
  const elements = document.querySelectorAll("main div");
  for (const e of elements) {
    await getLeaderboards(e);
  }
}

/**
 *
 * @param {Element} element
 */
async function getLeaderboards(element) {
  let lb = [];

  const id = element.getAttribute("id");
  const idArr = id.split(".");

  let formattedTime = "";

  if (idArr.length > 1) {
    const category = idArr[0];
    const path = idArr[1];
    const args = `path=${path}&category=${category}${formattedTime}&max=${maxLength}`;

    const url = `https://api.hyarcade.xyz/guildleaderboard?${args}&min`;
    console.info(`fetching ${url}`);
    const raw = await fetch(url, { mode: "cors" });
    lb = await raw.json();
  } else {
    const path = idArr[0];
    const args = `path=${path}${formattedTime}&max=${maxLength}`;

    const url = `https://api.hyarcade.xyz/guildleaderboard?${args}&min`;
    console.info(`fetching ${url}`);
    const raw = await fetch(url, { mode: "cors" });
    lb = await raw.json();
  }

  let text = "";

  if (formattedTime == "") {
    if (idArr.length > 1) {
      for (let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
        text += formatLine(lb[i].name, lb[i][idArr[0]][idArr[1]], lb[i].uuid, lb[i].color.toLowerCase(), lb[i].tag, lb[i].mvpColor);
      }
    } else {
      for (let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
        text += formatLine(lb[i].name, lb[i][idArr[0]], lb[i].uuid, lb[i].color.toLowerCase(), lb[i].tag, lb[i].mvpColor);
      }
    }
  } else {
    for (let i = 0; i < Math.min(maxLength, lb.length); i += 1) {
      text += formatLine(lb[i].name, lb[i]?.lbProp ?? 0, lb[i].uuid, lb[i].color.toLowerCase(), lb[i].tag, lb[i].mvpColor);
    }
  }

  element.innerHTML = `<h2 class="minecraft"> ${element
    .getAttribute("title")
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;")}</h2><ol>${text}</ol>`;
  element.setAttribute("vis", true);
}

/**
 * @param {string} name
 * @param {string} value
 * @param {string} uuid
 * @param {string} color
 * @param {string} tag
 * @returns {string}
 */
function formatLine(name, value, uuid, color, tag) {
  let longName = `${name}`;
  longName = `<a href="../guildstats?q=${uuid}" class="minecraft"><b class="${color}">${name} [${tag}]</b></a>`;
  if (value > 0) {
    return `<li>${longName} <i class="minecraft">${formatNum(value)}</i></li>`;
  }
  return "";
}

/**
 * @param number
 */
function formatNum(number) {
  const str = Number(number);
  if (number == undefined) {
    return Number(0).toLocaleString();
  }
  return str.toLocaleString();
}

window.addEventListener("load", load);
