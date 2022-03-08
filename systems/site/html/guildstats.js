const guildURL = "https://api.hyarcade.xyz/guild";

/**
 *
 * @param {string} uuid
 * @returns {string}
 */
function playerHead(uuid) {
  return `<img src="https://crafatar.com/avatars/${uuid}?overlay" />`;
}

/**
 *
 * @param {string} rank
 * @param {string} plusColor
 * @returns {string}
 */
function formatRank(rank, plusColor) {
  let betterRank = rank.replace(/_PLUS/g, "+");

  if (betterRank == "MVP++") {
    betterRank = `<b class="gold">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="gold">]</b>`;
  } else if (betterRank == "MVP+" || betterRank == "MVP") {
    betterRank = `<b class="aqua">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="aqua">]</b>`;
  } else if (betterRank == "VIP+" || betterRank == "VIP") {
    betterRank = `<b class="green">[${betterRank.replace(/\+/g, `<b class="${plusColor.toLowerCase()}">+</b>`)}</b><b class="green">]</b>`;
  } else {
    betterRank = "";
  }

  return betterRank;
}

/**
 *
 * @param {number} n
 * @returns {string}
 */
function formatNumber(n) {
  return Intl.NumberFormat("en").format(n);
}

/**
 *
 * @param {object} guild
 */
function formatTitle(guild) {
  const titleEle = document.querySelector("header");
  titleEle.innerHTML = `<p>${guild.name}</p> <div class="tag ${guild.color.toLowerCase()}">${guild.tag}</div>`;
}

/**
 *
 * @param {object} guild
 */
function formatWins(guild) {
  const memberEle = document.querySelector(".members");
  const members = guild.membersStats;

  for (const m of members) {
    memberEle.innerHTML += `<p>${playerHead(m.uuid)}<b>${formatRank(m?.rank ?? "", m?.plusColor ?? "GOLD")} ${m.name}</b><i>Wins ${formatNumber(m?.wins ?? 0)}</i></p>`;
  }
}

/**
 *
 * @param {object} guild
 */
function formatGames(guild) {
  const gamesEle = document.querySelector(".games");
  const gamesArr = [
    ["Party games", guild.partyGamesWins],
    ["Hypixel says", guild.hypixelSaysWins],
    ["Bounty Hunters", guild.bountyHuntersWins],
    ["Hole in the wall", guild.hitwWins],
    ["Farm hunt", guild.farmhuntWins],
    ["Mini walls", guild.miniWallsWins],
    ["Football", guild.footballWins],
    ["Ender spleef", guild.enderSpleefWins],
    ["Throw out", guild.throwOutWins],
    ["Galaxy wars", guild.galaxyWarsWins],
    ["Dragon wars", guild.dragonWarsWins],
    ["Blocking dead", guild.blockingDeadWins],
    ["Hide and seek", guild.hideAndSeekWins],
    ["Zombies", guild.zombiesWins],
    ["Pixel painters", guild.pixelPaintersWins],
    ["Seasonal games", guild.simWins],
  ];

  gamesArr.sort((a, b) => b[1] - a[1]);

  for (const g of gamesArr) {
    gamesEle.innerHTML += `<p><b>${g[0]}</b><i>${formatNumber(g[1])}</i></p><br>`;
  }
}

/**
 *
 * @param {object} guild
 */
function formatStats(guild) {
  const statsEle = document.querySelector(".stats");

  statsEle.innerHTML += `<p><b>Guild experience</b><i>${formatNumber(guild.gxp)}</i></p><br>`;
  statsEle.innerHTML += `<p><b>Arcade GXP</b><i>${formatNumber(guild.arcadeEXP)}</i></p><br>`;
  statsEle.innerHTML += `<p><b>Arcade coins</b><i>${formatNumber(guild.arcadeCoins)}</i></p><br>`;
}

/**
 *
 */
function updateData() {
  const id = decodeURI(new URLSearchParams(window.location.search).get("q"));

  fetch(`${guildURL}?uuid=${id.trim()}`).then(g => {
    g.json().then(gld => {
      const guild = gld;

      formatTitle(guild);
      formatStats(guild);
      formatGames(guild);
      formatWins(guild);
    });
  });
}

window.addEventListener("load", updateData);
