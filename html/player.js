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
 * @param {object} data 
 */
function arcade (data) {
  const ele = document.getElementById("arcwins");
  let html = "";

  html += "<h6>Overall arcade</h6><br />" +
    `- Wins : ${formatNum(data.arcadeWins)}<br />` + 
    `- Combined wins : ${formatNum(data.combinedArcadeWins)} <a href="https://docs.hyarcade.xyz/arcade-wins"><span style="font-size:12px" class="tooltip material-icons md-light">help</span></a><br />` +
    `- Coins : ${formatNum(data.arcadeCoins)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function partyGames (data) {
  const ele = document.getElementById("pg-wins");
  let html = "";

  html += `<h6>Party games</h6><br />- Wins : ${formatNum(data.wins)}`;

  ele.innerHTML = html;
}

/**
 * 
 * @param {object} data 
 */
function farmhunt (data) {
  const ele = document.getElementById("fh-wins");
  let html = "";

  html += `<h6>Farmhunt</h6><br />- Wins : ${formatNum(data.farmhuntWins)}<br />- Poop collected : ${formatNum(data.farmhuntShit)}`;

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
    `- Wins : ${formatNum(data.hitwWins)}<br />` + 
    `- Qualifiers : ${formatNum(data.hitwQual)}<br />` +
    `- Finals : ${formatNum(data.hitwFinal)}<br />` +
    `- Rounds : ${formatNum(data.hitwRounds)}`;

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
    `- Wins : ${formatNum(data.hypixelSaysWins)}<br />` + 
    `- Rounds : ${formatNum(data.extras.hypixelSaysRounds)}`;

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
    `- Wins : ${formatNum(data.blockingDeadWins)}<br />` + 
    `- Kills : ${formatNum(data.extras.blockingDeadKills)}<br />` +
    `- Headshots : ${formatNum(data.extras.blockingDeadHeadshots)}`;

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
    `- Wins : ${formatNum(data.miniWallsWins)}<br />` + 
    `- Kills : ${formatNum(data.miniWalls.kills)}<br />` +
    `- Deaths : ${formatNum(data.miniWalls.deaths)}<br />` +
    `- Final kills : ${formatNum(data.miniWalls.finalKills)}<br />` +
    `- Wither damage : ${formatNum(data.miniWalls.witherDamage)}<br />` +
    `- Wither kills : ${formatNum(data.miniWalls.witherKills)}<br />`;

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
    `- Wins : ${formatNum(data.footballWins)}<br />` + 
    `- Kicks : ${formatNum(data.extras.footballKicks)}<br />` +
    `- Power kicks : ${formatNum(data.extras.footballPKicks)}<br />` +
    `- Goals : ${formatNum(data.extras.footballGoals)}`;

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
    `- Wins : ${formatNum(data.throwOutWins)}<br />` + 
    `- Kills : ${formatNum(data.extras.throwOutKills)}<br />` +
    `- Deaths : ${formatNum(data.extras.throwOutDeaths)}`;

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
    `- Wins : ${formatNum(data.enderSpleefWins)}`;

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
    `- Wins : ${formatNum(data.galaxyWarsWins)}<br />` + 
    `- Kills : ${formatNum(data.extras.galaxyWarsKills)}<br />` +
    `- Deaths : ${formatNum(data.extras.galaxyWarsDeaths)}`;

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
    `- Wins : ${formatNum(data.dragonWarsWins)}<br />` + 
    `- Kills : ${formatNum(data.extras.dragonWarsKills)}`;

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
    `- Wins : ${formatNum(data.bountyHuntersWins)}<br />` + 
    `- Kills : ${formatNum(data.extras.bountyHuntersKills)}<br />` +
    `- Bounty kills : ${formatNum(data.extras.bountyHuntersBountyKills)}<br />` +
    `- Deaths : ${formatNum(data.extras.bountyHuntersDeaths)}`;

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
    `- Wins : ${formatNum(data.hideAndSeekWins)}<br />` + 
    `- Hider wins : ${formatNum(data.extras.HNSHiderWins)}<br />` +
    `- Seeker wins : ${formatNum(data.extras.HNSSeekerWins)}<br />` +
    `- Kills : ${formatNum(data.hnsKills)}`;

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
    `- Wins : ${formatNum(data.zombiesWins)}<br />` + 
    `- Bad blood wins : ${formatNum(data.zombies.wins_zombies_badblood)}<br />` +
    `- Dead end wins : ${formatNum(data.zombies.wins_zombies_deadend)}<br />` +
    `- Alien arcadium wins : ${formatNum(data.zombies.wins_zombies_alienarcadium)}`;

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
    `- Wins : ${formatNum(data.pixelPaintersWins)}`;

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
    `- Captures : ${formatNum(data.ctwWoolCaptured)}<br />` + 
    `- Kills : ${formatNum(data.ctwKills)}`;

  ele.innerHTML = html;
}


/**
 * @param {object} data
 */
function displayData (data) {
  console.log(data);
  const ver = data.version ? data.version : "1.8.9";
  //// setHtmlByName("arcwins", `Arcade wins: ${formatNum(data.arcadeWins)}`);
  arcade(data);
  //// setHtmlByName("pg-wins", `Party games wins: ${formatNum(data.wins)}`);
  partyGames(data);
  //// setHtmlByName("fh-wins", `Farm hunt wins: ${formatNum(data.farmhuntWins)}`);
  farmhunt(data);
  //// setHtmlByName("hitw", `HITW wins: ${data.hitwWins}`);
  hitw(data);
  //// setHtmlByName("hysay", `Hypixel says wins: ${formatNum(data.hypixelSaysWins)}`);
  hypixelSays(data);
  //// setHtmlByName(
  ////   "bd",
  ////   `BD: W:${formatNum(data.blockingDeadWins)} / K:${formatNum(data.extras.blockingDeadKills)} / HS:${formatNum(
  ////     data.extras.blockingDeadHeadshots
  ////   )}`
  //// );
  blockingDead(data);
  //// setHtmlByName("mw", `Mini walls wins: ${formatNum(data.miniWallsWins)}`);
  miniWalls(data);
  //// setHtmlByName("fb", `Football wins: ${formatNum(data.footballWins)}`);
  football(data);
  //// setHtmlByName("es", `Ender spleef wins: ${formatNum(data.enderSpleefWins)}`);
  enderSpleef(data);
  //// setHtmlByName("to", `Throw out wins: ${formatNum(data.throwOutWins)}`);
  throwOut(data);
  //// setHtmlByName("gw", `Galaxy wars wins: ${formatNum(data.galaxyWarsWins)}`);
  galaxyWars(data);
  //// setHtmlByName("dw", `Dragon wars wins: ${formatNum(data.dragonWarsWins)}`);
  dragonWars(data);
  //// setHtmlByName("bh", `Bounty hunter wins: ${formatNum(data.bountyHuntersWins)}`);
  bountyHunters(data);
  //// setHtmlByName("hns", `Hide and seek wins: ${formatNum(data.hideAndSeekWins)}`);
  hideAndSeek(data);
  //// setHtmlByName("z", `Zombie wins: ${formatNum(data.zombiesWins)}`);
  zombies(data);
  //// setHtmlByName("pp", `Pixel painter wins: ${formatNum(data.pixelPaintersWins)}`);
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
