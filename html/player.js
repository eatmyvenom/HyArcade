/* eslint-disable no-unused-vars */
let playername = undefined;
let playerdata = undefined;
let urlParams = undefined;
let guildData = undefined;

// eslint-disable-next-line
function setName (name) {
  playername = name;
  refresh();
}

/**
 * 
 * @param {KeyboardEvent} event 
 */
function ignIpt (event) {
  if (event.key == "Enter") {
    setName(event.target.value);
    event.target.blur();
  }
}

// eslint-disable-next-line
function btnClick () {
  setName(document.getElementById("ign").value);
}

/**
 * @param {string} name
 * @param {Element} html
 */
function setHtmlByName (name, html) {
  document.getElementById(name).innerHTML = html.replace(/undefined/g, "0");
}

/**
 *
 */
function refresh () {
  handleData().then(() => console.log("Data updated!"));
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

/**
 *
 * @param {string} page
 * @returns {string} 
 */
function lilQuestionMark (page) {
  return `<a href="https://docs.hyarcade.xyz/api/${page}"><span style="font-size:12px" class="tooltip material-icons md-light">help</span></a>`;
}

/**
 * 
 * @param {object} data 
 */
function arcade (data) {
  const ele = document.getElementById("arcwins");
  let html = "";

  html += "<h6 class='yellow'>Overall Arcade</h6><br />" +
    `Wins:  <span class="gray">${formatNum(data.arcadeWins)}</span><br />` + 
    `Combined Wins:  <span class="gray">${formatNum(data.combinedArcadeWins)} ${lilQuestionMark("arcade-wins")}</span><br /><br />` +

    `Challenges:  <span class="gray">${formatNum(Object.values(data.arcadeChallenges).reduce((p, c) => p + c, 0))}</span><br />` +
    `Quests:  <span class="gray">${formatNum(Object.values(data.quests).reduce((p, c) => p + c, 0))}</span><br /><br />` +

    `Coins: <span class="gray">${formatNum(data.arcadeCoins)}</span><br /><br />` +

    `Achievements: <span class="gray">${data.arcadeAchievments.totalEarned} / ${data.arcadeAchievments.totalAvailiable} (${Math.round((data.arcadeAchievments.totalEarned / data.arcadeAchievments.totalAvailiable) * 100)}%)</span>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function partyGames (data) {
  const ele = document.getElementById("pg-wins");
  let html = "";

  html += "<h6 class='yellow'>Party Games</h6><br />" +
  `Wins: <span class="gray">${formatNum(data.partyGames.wins)}</span><br /><br />` +

  `Rounds Won: <span class="gray">${formatNum(data.partyGames.roundsWon)}</span><br />` +
  `Stars Earned: <span class="gray">${formatNum(data.partyGames.starsEarned)}</span><br /><br />` +

  `Achievements: <span class="gray">${data.arcadeAchievments.partyGames.apEarned} / ${data.arcadeAchievments.partyGames.apAvailable} (${Math.round((data.arcadeAchievments.partyGames.apEarned / data.arcadeAchievments.partyGames.apAvailable) * 100)}%)</span>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function farmhunt (data) {
  const ele = document.getElementById("fh-wins");
  let html = "";

  html += `<h6 class='yellow'>Farm Hunt</h6><br />Total Wins: <span class="gray">${formatNum(data.farmhunt.wins)}</span><br />` +
  `Animal Wins: <span class="gray">${formatNum(data.farmhunt.animalWins)}</span><br />` + 
  `Hunter Wins: <span class="gray">${formatNum(data.farmhunt.hunterWins)}</span><br /><br />` + 

  `Total Kills: <span class="gray">${formatNum(data.farmhunt.kills)}</span><br />` + 
  `Animal Kills: <span class="gray">${formatNum(data.farmhunt.animalKills)}</span><br />` + 
  `Hunter Kills: <span class="gray">${formatNum(data.farmhunt.hunterKills)}</span><br /><br />` +

  `Taunts Used: <span class="gray">${formatNum(data.farmhunt.tauntsUsed)}</span><br /><br />` +

  `${formatAp(data.arcadeAchievments.farmHunt)}`;

  ele.innerHTML = html;
}

function formatAp (obj) {
  return `Achievements: <span class="gray">${obj.apEarned} / ${obj.apAvailable} (${Math.round((obj.apEarned / obj.apAvailable) * 100)}%)</span>`;
}

/**
 * 
 * @param {object} data 
 */
function hitw (data) {
  const ele = document.getElementById("hitw");
  let html = "";

  html += "<h6 class='yellow'>Hole in the Wall</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.holeInTheWall.wins)}</span><br /><br />` + 

    `Qualifiers: <span class="gray">${formatNum(data.holeInTheWall.qualifiers)}</span><br />` +
    `Finals: <span class="gray">${formatNum(data.holeInTheWall.finals)}</span><br /><br />` +

    `Walls Faced: <span class="gray">${formatNum(data.holeInTheWall.rounds)} ${lilQuestionMark("rounds")}</span><br /><br />` +

    `${formatAp(data.arcadeAchievments.holeInTheWall)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function hypixelSays (data) {
  const ele = document.getElementById("hysay");
  let html = "";

  html += "<h6 class='yellow'>Hypixel Says</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.hypixelSays.wins)}</span><br /><br />` +

    `Round Wins: <span class="gray">${formatNum(data.hypixelSays.totalRoundWins)}</span><br />` +
    `Best Score: <span class="gray">${formatNum(data.hypixelSays.maxScore)}</span><br />` +
    `Points: <span class="gray">${formatNum(data.hypixelSays.rounds)}</span><br /><br />` +
    `${formatAp(data.arcadeAchievments.hypixelSays)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function blockingDead (data) {
  const ele = document.getElementById("bd");
  let html = "";

  html += "<h6 class='yellow'>Blocking Dead</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.blockingDead.wins)}</span><br />` + 
    `Kills: <span class="gray">${formatNum(data.blockingDead.kills)}</span><br />` +
    `Headshots: <span class="gray">${formatNum(data.blockingDead.headshots)}</span><br /><br />` +

    `${formatAp(data.arcadeAchievments.blockingDead)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function miniWalls (data) {
  const ele = document.getElementById("mw");
  let html = "";

  html += "<h6 class='yellow'>Mini Walls</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.miniWalls.wins)}</span><br /><br />` +

    `Kills: <span class="gray">${formatNum(data.miniWalls.kills)}</span><br />` +
    `Final kills: <span class="gray">${formatNum(data.miniWalls.finalKills)}</span><br /><br />` +

    `Deaths: <span class="gray">${formatNum(data.miniWalls.deaths)}</span><br /><br />` +

    `Wither damage: <span class="gray">${formatNum(data.miniWalls.witherDamage)}</span><br />` +
    `Wither kills: <span class="gray">${formatNum(data.miniWalls.witherKills)}</span><br /><br />` +

    `${formatAp(data.arcadeAchievments.miniWalls)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function football (data) {
  const ele = document.getElementById("fb");
  let html = "";

  html += "<h6 class='yellow'>Football</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.football.wins)}</span><br /><br />` + 

    `Kicks: <span class="gray">${formatNum(data.football.kicks)}</span><br />` +
    `Power kicks: <span class="gray">${formatNum(data.football.powerkicks)}</span><br /><br />` +

    `Goals: <span class="gray">${formatNum(data.football.goals)}</span><br /><br />` +

    `${formatAp(data.arcadeAchievments.football)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function throwOut (data) {
  const ele = document.getElementById("to");
  let html = "";

  html += "<h6 class='yellow'>Throw Out</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.throwOut.wins)}</span><br /><br />` + 

    `Kills: <span class="gray">${formatNum(data.throwOut.kills)}</span><br />` +
    `Deaths: <span class="gray">${formatNum(data.throwOut.deaths)}</span><br /><br />` +

    `${formatAp(data.arcadeAchievments.throwOut)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function enderSpleef (data) {
  const ele = document.getElementById("es");
  let html = "";

  html += "<h6 class='yellow'>Ender Spleef</h6><br />" +
  `Wins: <span class="gray">${formatNum(data.enderSpleef.wins)}</span><br /><br />` +

  `Blocks Broken: <span class="gray">${formatNum(data.enderSpleef.blocksBroken)}</span><br /><br />` +

  `Total Powerups: <span class="gray">${formatNum(data.enderSpleef.totalPowerups)}</span><br />` +
  `Big Shot Powerups: <span class="gray">${formatNum(data.enderSpleef.bigshotPowerups)}</span><br />` +
  `Triple Shot Powerups:<span class="gray"> ${formatNum(data.enderSpleef.tripleshotPowerups)}</span><br /><br />` +

  `${formatAp(data.arcadeAchievments.enderSpleef)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function galaxyWars (data) {
  const ele = document.getElementById("gw");
  let html = "";

  html += "<h6 class='yellow'>Galaxy Wars</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.galaxyWars.wins)}</span><br /><br />` +

    `Kills: <span class="gray">${formatNum(data.galaxyWars.kills)}</span><br />` +
    `Deaths: <span class="gray">${formatNum(data.galaxyWars.deaths)}</span><br /><br />` + 

    `${formatAp(data.arcadeAchievments.galaxyWars)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function dragonWars (data) {
  const ele = document.getElementById("dw");
  let html = "";

  html += "<h6 class='yellow'>Dragon Wars</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.dragonWars.wins)}</span><br />` + 
    `Kills: <span class="gray">${formatNum(data.dragonWars.kills)}</span><br /><br />` +

    `${formatAp(data.arcadeAchievments.dragonWars)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function bountyHunters (data) {
  const ele = document.getElementById("bh");
  let html = "";

  html += "<h6 class='yellow'>Bounty Hunters</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.bountyHunters.wins)}</span><br /><br />` + 

    `Kills: <span class="gray">${formatNum(data.bountyHunters.kills)}</span><br />` +
    `Sword Kills: <span class="gray">${formatNum(data.bountyHunters.swordKills)}</span><br />` +
    `Bow Kills: <span class="gray">${formatNum(data.bountyHunters.bowKills)}</span><br /><br />` +

    `Bounty kills: <span class="gray">${formatNum(data.bountyHunters.bountyKills)}</span><br /><br />` +

    `Deaths: <span class="gray">${formatNum(data.bountyHunters.deaths)}</span><br /><br />` +

    `${formatAp(data.arcadeAchievments.bountyHunters)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function hideAndSeek (data) {
  const ele = document.getElementById("hns");
  let html = "";

  html += "<h6 class='yellow'>Hide and Seek</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.hideAndSeek.wins)}</span><br />` + 
    `Hider wins: <span class="gray">${formatNum(data.hideAndSeek.hiderWins)}</span><br />` +
    `Seeker wins: <span class="gray">${formatNum(data.hideAndSeek.seekerWins)}</span><br /><br />` +

    `Kills: <span class="gray">${formatNum(data.hideAndSeek.kills)}</span><br /><br />` +

    `${formatAp(data.arcadeAchievments.hideAndSeek)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function zombies (data) {
  const ele = document.getElementById("z");
  let html = "";

  html += "<h6 class='yellow'>Zombies</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.zombies.wins_zombies)}</span><br />` + 
    `Bad blood wins: <span class="gray">${formatNum(data.zombies.wins_zombies_badblood)}</span><br />` +
    `Dead end wins : <span class="gray">${formatNum(data.zombies.wins_zombies_deadend)}</span><br /><br />` +
    `Alien arcadium wins: <span class="gray">${formatNum(data.zombies.wins_zombies_alienarcadium)}</span><br />` +

    `${formatAp(data.arcadeAchievments.zombies)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function pixelPainters (data) {
  const ele = document.getElementById("pp");
  let html = "";

  html += "<h6 class='yellow'>Pixel Painters</h6><br />" +
    `Wins: <span class="gray">${formatNum(data.pixelPainters.wins)}</span><br /><br />` +
    `${formatAp(data.arcadeAchievments.pixelPainters)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function captureTheWool (data) {
  const ele = document.getElementById("ctw");
  let html = "";

  html += "<h6 class='yellow'>Capture the Wool</h6><br />" +
    `Captures: <span class="gray">${formatNum(data.captureTheWool.woolCaptures)}</span><br />` + 
    `Kills: <span class="gray">${formatNum(data.captureTheWool.kills)}</span><br /><br />` +

    `${formatAp(data.arcadeAchievments.captureTheWool)}`;

  ele.innerHTML = html;
}


/**
 * @param {object} data
 */
function displayData (data) {
  console.log(data);

  arcade(data);
  partyGames(data);
  farmhunt(data);
  hitw(data);
  hypixelSays(data);
  blockingDead(data);
  miniWalls(data);
  football(data);
  enderSpleef(data);
  throwOut(data);
  galaxyWars(data);
  dragonWars(data);
  bountyHunters(data);
  hideAndSeek(data);
  zombies(data);
  pixelPainters(data);
  captureTheWool(data);

  setHtmlByName("name", `${formatRank(data.rank, data.plusColor, data.name, data.mvpColor)}`);
  setHtmlByName("xp", `<b class="aqua">Level - ${formatNum(data.level)}</b>`);
  setHtmlByName("karma", `<b class="light_purple"> Karma - ${formatNum(data.karma)}</b>`);
  setHtmlByName("aap", `<b class="green">Arcade AP - ${data.arcadeAchievments.totalEarned} / ${data.arcadeAchievments.totalAvailiable}</b>`);

}

/**
 * 
 * @param {string} rank 
 * @param {string} plusColor 
 * @param {string} name
 * @param {string} mvpColor
 * @returns {string}
 */
function formatRank (rank, plusColor, name = "", mvpColor = "GOLD") {
  let betterRank = `${rank}`.replace(/_PLUS/g, "+");

  if(name != "") {
    // eslint-disable-next-line no-param-reassign
    name = ` ${name}`;
  }

  if(betterRank == "MVP++") {
    betterRank = `<b class="${mvpColor.toLowerCase()}">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="${mvpColor.toLowerCase()}">]${name}</b>`;
  } else if(betterRank == "MVP+" || betterRank == "MVP") {
    betterRank = `<b class="aqua">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="aqua">]${name}</b>`;
  } else if(betterRank == "VIP+" || betterRank == "VIP") {
    betterRank = `<b class="green">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="green">]${name}</b>`;
  } else if(betterRank == "YOUTUBER") {
    betterRank = `<b class="red">[</b><b class="white">YOUTUBE</b><b class="red">]${name}</b>`;
  } else if(betterRank == "ADMIN") {
    betterRank = `<b class="red">[ADMIN]${name}</b>`;
  } else {
    betterRank = `<b class="gray">${name}</b>`;
  }

  return betterRank;
}

/**
 *
 */
async function handleData () {
  let rawjson;

  if(playerdata?.name?.toLowerCase()?.startsWith(playername.toLowerCase())) {
    return;
  }

  if(playername.length > 16) {
    rawjson = await fetch(`https://cdn.hyarcade.xyz/account?uuid=${playername}`);
  } else {
    rawjson = await fetch(`https://cdn.hyarcade.xyz/account?ign=${playername}`);
  }
  playerdata = await rawjson.json();

  if(playerdata != undefined && playerdata.name != undefined) {
    playername = playerdata.name;
    displayData(playerdata);
    if(urlParams.has("q")) {
      if(urlParams.get("q").toLowerCase() != playername.toLowerCase()) {
        urlParams.set("q", playername);
        window.history.replaceState(
          window.history.state,
          "",
          `${window.location.pathname}?${urlParams.toString()}`
        );
      }
    } else {
      urlParams.append("q", playername);
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}?${urlParams.toString()}`
      );
    }

  }

  await nameHist(playerdata.uuid);
  await accStatus(playerdata.uuid);
  await guildStats(playerdata.guildID);
  // await recentgames(playerdata.uuid);
}

function makeTag (tag, color) {
  return `<b class="${color.toLowerCase()}">[${tag.toUpperCase()}]</b>`;
}

async function guildStats (id) {
  if (guildData == undefined) {
    guildData = await fetch("https://hyarcade.xyz/resources/guild.json");
    guildData = await guildData.json();
  }

  const guild = guildData.find((g) => g.uuid == id);

  if(guild != undefined) {
    document.getElementById("guild").style.display = "block";
    setHtmlByName("gname", `<b class="aqua">Name - ${guild.name}</b>`);
    setHtmlByName("gtag", `<b class="white">Tag - ${makeTag(guild.tag, guild.color)}</b>`);
    setHtmlByName("gmembercount", `<b class="light_purple">Members - ${guild.memberUUIDs.length}</b>`);
  } else {
    document.getElementById("guild").style.display = "none";
  }
}

async function accStatus (uuid) {
  let slothData = await fetch(`https://api.slothpixel.me/api/players/${uuid}/status`);
  slothData = await slothData.json();

  setHtmlByName("stsonline", `<b class="aqua">Online - ${slothData.online}</b>`);
  setHtmlByName("stsgame", `<b class="green">Game - ${slothData.game.type}</b>`);
  setHtmlByName("stsmode", `<b class="light_purple">Mode - ${slothData.game.mode}</b>`);
  setHtmlByName("stsmap", `<b class="yellow">Map - ${slothData.game.map}</b>`);
}

async function recentgames (uuid) {
  let slothData = await fetch(`https://api.slothpixel.me/api/players/${uuid}/recentGames`);
  slothData = await slothData.json();

  let str = "";

  for(const game of slothData) {
    str += `${game.gameType} - ${game.mode} - ${game.map}<br />`;
  }

  document.getElementById("recents").innerHTML += str;
}

async function nameHist (uuid) {
  let mojData = await fetch(`https://api.ashcon.app/mojang/v2/user/${uuid}`);
  mojData = await mojData.json();

  setHtmlByName("namehist", `<b class="gold"><u>Name History</u></b><br><b class="yellow">${mojData.username_history.map((e) => e.username).reverse().join("<br>")}</b>`);
}

function focusSearch (event) {
  if(event.key == "/") {
    event.preventDefault();
    document.getElementById("ign").focus();
    document.getElementById("ign").select();
  }
}

function getSuggestions (event) {
  const query = event.target.value;
  if(query.trim() != "") {
    fetch(`https://cdn.hyarcade.xyz/resolve?q=${query.trim()}`)
      .then(displaySuggestions)
      .catch(console.error);
  }
}

async function displaySuggestions (data) {
  const list = await data.json();

  const suggestions = document.querySelector("body > nav > article > span");
  suggestions.innerHTML = "";

  list.forEach((name) => {
    suggestions.innerHTML += `<b>${name}</b><br />`;
  });
}

/**
 *
 */
function loadPage () {
  const queryString = window.location.search;
  urlParams = new URLSearchParams(queryString);
  playername = urlParams.get("q");

  refresh();
  document.getElementById("ign").value = urlParams.get("q");
  document.getElementById("ign").addEventListener("keydown", ignIpt);
  // document.getElementById("ign").addEventListener("input", getSuggestions);
  document.getElementById("query").addEventListener("click", btnClick);

  window.addEventListener("keydown", focusSearch);
}

window.addEventListener("load", loadPage);
