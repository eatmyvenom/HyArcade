let playername = undefined;
let urlParams = undefined;

// eslint-disable-next-line
function setName (name) {
  playername = name;
  refresh();
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
 * @param {string} time
 * @returns {string}
 */
function formatTime (time) {
  return new Date(time).toLocaleString();
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
 * @param {string} uuid
 */
function setIcon (uuid) {
  let link = document.querySelector("link[rel~='icon']");
  if(!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  link.href = `https://crafatar.com/avatars/${uuid}?overlay`;
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

  html += "<h6>Overall arcade</h6><br />" +
    `- Wins : ${formatNum(data.arcadeWins)}<br />` + 
    `- Combined wins : ${formatNum(data.combinedArcadeWins)} ${lilQuestionMark("arcade-wins")}<br />` +
    `- Coins : ${formatNum(data.arcadeCoins)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.totalEarned / data.arcadeAchievments.totalAvailiable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.totalEarned}" max="${data.arcadeAchievments.totalAvailiable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function partyGames (data) {
  const ele = document.getElementById("pg-wins");
  let html = "";

  html += `<h6>Party games</h6><br />- Wins : ${formatNum(data.partyGames.wins)}<br >` +
  `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.partyGames.apEarned / data.arcadeAchievments.partyGames.apAvailable) * 100)}% </label>` +
  `<progress id="ap" value="${data.arcadeAchievments.partyGames.apEarned}" max="${data.arcadeAchievments.partyGames.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function farmhunt (data) {
  const ele = document.getElementById("fh-wins");
  let html = "";

  html += `<h6>Farmhunt</h6><br />- Wins : ${formatNum(data.farmhunt.wins)}<br />- Poop collected : ${formatNum(data.farmhunt.poop)}<br >` +
  `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.farmHunt.apEarned / data.arcadeAchievments.farmHunt.apAvailable) * 100)}% </label>` +
  `<progress id="ap" value="${data.arcadeAchievments.farmHunt.apEarned}" max="${data.arcadeAchievments.farmHunt.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function hitw (data) {
  const ele = document.getElementById("hitw");
  let html = "";

  html += "<h6>Hole in the wall</h6><br />" +
    `- Wins : ${formatNum(data.holeInTheWall.wins)}<br />` + 
    `- Qualifiers : ${formatNum(data.holeInTheWall.qualifiers)}<br />` +
    `- Finals : ${formatNum(data.holeInTheWall.finals)}<br />` +
    `- Rounds : ${formatNum(data.holeInTheWall.rounds)} ${lilQuestionMark("rounds")}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.holeInTheWall.apEarned / data.arcadeAchievments.holeInTheWall.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.holeInTheWall.apEarned}" max="${data.arcadeAchievments.holeInTheWall.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function hypixelSays (data) {
  const ele = document.getElementById("hysay");
  let html = "";

  html += "<h6>Hypixel says</h6><br />" +
    `- Wins : ${formatNum(data.hypixelSays.wins)}<br />` + 
    `- Rounds : ${formatNum(data.hypixelSays.rounds)} ${lilQuestionMark("rounds")}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.hypixelSays.apEarned / data.arcadeAchievments.hypixelSays.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.hypixelSays.apEarned}" max="${data.arcadeAchievments.hypixelSays.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function blockingDead (data) {
  const ele = document.getElementById("bd");
  let html = "";

  html += "<h6>Blocking dead</h6><br />" +
    `- Wins : ${formatNum(data.blockingDead.wins)}<br />` + 
    `- Kills : ${formatNum(data.blockingDead.kills)}<br />` +
    `- Headshots : ${formatNum(data.blockingDead.headshots)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.blockingDead.apEarned / data.arcadeAchievments.blockingDead.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.blockingDead.apEarned}" max="${data.arcadeAchievments.blockingDead.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function miniWalls (data) {
  const ele = document.getElementById("mw");
  let html = "";

  html += "<h6>Mini walls</h6><br />" +
    `- Wins : ${formatNum(data.miniWalls.wins)}<br />` + 
    `- Kills : ${formatNum(data.miniWalls.kills)}<br />` +
    `- Deaths : ${formatNum(data.miniWalls.deaths)}<br />` +
    `- Final kills : ${formatNum(data.miniWalls.finalKills)}<br />` +
    `- Wither damage : ${formatNum(data.miniWalls.witherDamage)}<br />` +
    `- Wither kills : ${formatNum(data.miniWalls.witherKills)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.miniWalls.apEarned / data.arcadeAchievments.miniWalls.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.miniWalls.apEarned}" max="${data.arcadeAchievments.miniWalls.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function football (data) {
  const ele = document.getElementById("fb");
  let html = "";

  html += "<h6>Football</h6><br />" +
    `- Wins : ${formatNum(data.football.wins)}<br />` + 
    `- Kicks : ${formatNum(data.football.kicks)}<br />` +
    `- Power kicks : ${formatNum(data.football.powerkicks)}<br />` +
    `- Goals : ${formatNum(data.football.goals)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.football.apEarned / data.arcadeAchievments.football.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.football.apEarned}" max="${data.arcadeAchievments.football.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function throwOut (data) {
  const ele = document.getElementById("to");
  let html = "";

  html += "<h6>Throw out</h6><br />" +
    `- Wins : ${formatNum(data.throwOut.wins)}<br />` + 
    `- Kills : ${formatNum(data.throwOut.kills)}<br />` +
    `- Deaths : ${formatNum(data.throwOut.deaths)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.throwOut.apEarned / data.arcadeAchievments.throwOut.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.throwOut.apEarned}" max="${data.arcadeAchievments.throwOut.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function enderSpleef (data) {
  const ele = document.getElementById("es");
  let html = "";

  html += "<h6>Ender spleef</h6><br />" +
    `- Wins : ${formatNum(data.enderSpleef.wins)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.enderSpleef.apEarned / data.arcadeAchievments.enderSpleef.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.enderSpleef.apEarned}" max="${data.arcadeAchievments.enderSpleef.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function galaxyWars (data) {
  const ele = document.getElementById("gw");
  let html = "";

  html += "<h6>Galaxy wars</h6><br />" +
    `- Wins : ${formatNum(data.galaxyWars.wins)}<br />` + 
    `- Kills : ${formatNum(data.galaxyWars.kills)}<br />` +
    `- Deaths : ${formatNum(data.galaxyWars.deaths)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function dragonWars (data) {
  const ele = document.getElementById("dw");
  let html = "";

  html += "<h6>Dragon wars</h6><br />" +
    `- Wins : ${formatNum(data.dragonWars.wins)}<br />` + 
    `- Kills : ${formatNum(data.dragonWars.kills)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.dragonWars.apEarned / data.arcadeAchievments.dragonWars.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.dragonWars.apEarned}" max="${data.arcadeAchievments.dragonWars.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function bountyHunters (data) {
  const ele = document.getElementById("bh");
  let html = "";

  html += "<h6>Bounty hunters</h6><br />" +
    `- Wins : ${formatNum(data.bountyHunters.wins)}<br />` + 
    `- Kills : ${formatNum(data.bountyHunters.kills)}<br />` +
    `- Bounty kills : ${formatNum(data.bountyHunters.bountyKills)}<br />` +
    `- Deaths : ${formatNum(data.bountyHunters.deaths)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.bountyHunters.apEarned / data.arcadeAchievments.bountyHunters.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.bountyHunters.apEarned}" max="${data.arcadeAchievments.bountyHunters.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function hideAndSeek (data) {
  const ele = document.getElementById("hns");
  let html = "";

  html += "<h6>Hide and seek</h6><br />" +
    `- Wins : ${formatNum(data.hideAndSeek.wins)}<br />` + 
    `- Hider wins : ${formatNum(data.hideAndSeek.hiderWins)}<br />` +
    `- Seeker wins : ${formatNum(data.hideAndSeek.seekerWins)}<br />` +
    `- Kills : ${formatNum(data.hideAndSeek.kills)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.hideAndSeek.apEarned / data.arcadeAchievments.hideAndSeek.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.hideAndSeek.apEarned}" max="${data.arcadeAchievments.hideAndSeek.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function zombies (data) {
  const ele = document.getElementById("z");
  let html = "";

  html += "<h6>Zombies</h6><br />" +
    `- Wins : ${formatNum(data.zombies.wins_zombies)}<br />` + 
    `- Bad blood wins : ${formatNum(data.zombies.wins_zombies_badblood)}<br />` +
    `- Dead end wins : ${formatNum(data.zombies.wins_zombies_deadend)}<br />` +
    `- Alien arcadium wins : ${formatNum(data.zombies.wins_zombies_alienarcadium)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.hideAndSeek.apEarned / data.arcadeAchievments.hideAndSeek.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.hideAndSeek.apEarned}" max="${data.arcadeAchievments.hideAndSeek.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function pixelPainters (data) {
  const ele = document.getElementById("pp");
  let html = "";

  html += "<h6>Pixel painters</h6><br />" +
    `- Wins : ${formatNum(data.pixelPainters.wins)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.pixelPainters.apEarned / data.arcadeAchievments.pixelPainters.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.pixelPainters.apEarned}" max="${data.arcadeAchievments.pixelPainters.apAvailable}"></progress>`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function captureTheWool (data) {
  const ele = document.getElementById("ctw");
  let html = "";

  html += "<h6>Capture the wool</h6><br />" +
    `- Captures : ${formatNum(data.captureTheWool.woolCaptures)}<br />` + 
    `- Kills : ${formatNum(data.captureTheWool.kills)}<br >` +
    `<label for="ap">- Achievements : ${Math.round((data.arcadeAchievments.captureTheWool.apEarned / data.arcadeAchievments.captureTheWool.apAvailable) * 100)}% </label>` +
    `<progress id="ap" value="${data.arcadeAchievments.captureTheWool.apEarned}" max="${data.arcadeAchievments.captureTheWool.apAvailable}"></progress>`;

  ele.innerHTML = html;
}


/**
 * @param {object} data
 */
function displayData (data) {
  console.log(data);
  const ver = data.version ? data.version : "1.8.9";

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

  setHtmlByName("xp", `Level: ${formatNum(data.level)}`);
  setHtmlByName("karma", `Karma: ${formatNum(data.karma)}`);
  setHtmlByName("name", `Name: ${data.name}`);
  setHtmlByName("uuid", `UUID: ${data.uuid}`);
  if(data.rank) {
    setHtmlByName("rank", `Rank: ${data.rank.replace(/_/g, "").replace(/PLUS/g, "+")}`);
  } else {
    setHtmlByName("rank", "Rank: Non");
  }
  setHtmlByName("version", `Version: ${ver}`);
  setHtmlByName("loggedIn", `Online: ${data.isLoggedIn}`);
  setHtmlByName("firstLogin", `First login: ${formatTime(data.firstLogin)}`);
  document
    .getElementById("render")
    .setAttribute(
      "src",
      `https://crafatar.com/renders/body/${data.uuid}?size=512&default=MHF_Steve&scale=10&overlay`
    );
  document.getElementById("lvlimg").setAttribute("src", `https://gen.plancke.io/exp/${data.uuid}.png`);
  document
    .getElementById("achivimg")
    .setAttribute("src", `https://gen.plancke.io/achievementPoints/${data.uuid}.png`);

  setIcon(data.uuid);
}

/**
 *
 */
async function handleData () {
  let rawjson;
  if(playername.length > 16) {
    rawjson = await fetch(`https://cdn.hyarcade.xyz/account?uuid=${playername}`);
  } else {
    rawjson = await fetch(`https://cdn.hyarcade.xyz/account?ign=${playername}`);
  }
  const playerdata = await rawjson.json();
  if(playerdata != undefined && playerdata.name != undefined) {
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
}

window.addEventListener("load", loadPage);
