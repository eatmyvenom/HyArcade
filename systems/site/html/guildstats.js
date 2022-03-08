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
 * @returns {string}
 */
function getRankColor(rank) {
  let betterRank = rank.replace(/_PLUS/g, "+");

  if (betterRank == "MVP++") {
    return "gold";
  } else if (betterRank == "MVP+" || betterRank == "MVP") {
    return "aqua";
  } else if (betterRank == "VIP+" || betterRank == "VIP") {
    return "green";
  } else {
    return "gray";
  }
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
  const members = guild.membersStats ?? [];

  members.sort((m1, m2) => {
    return (m2.guildRank?.priority ?? 999) - (m1.guildRank?.priority ?? 999);
  });

  for (const m of members) {
    let wins = `<i>Wins ${formatNumber(m?.arcadeWins ?? 0)}</i>`;

    let rankTag = m.guildRank ? m.guildRank.tag : "GM";

    let guildRank;
    guildRank = rankTag == undefined ? "" : `<span class="dark_aqua">[${rankTag}]</span> `;

    let player = `<b class="${getRankColor(m?.rank ?? "")}">${guildRank}${m.name}</b>`;
    memberEle.innerHTML += `<p>${playerHead(m.uuid)}${player}${wins}</p>`;
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

  statsEle.innerHTML += `<p><b>Guild experience</b><i>${formatNumber(guild.gexp)}</i></p><br>`;
  statsEle.innerHTML += `<p><b>Arcade GXP</b><i>${formatNumber(guild.arcadeEXP)}</i></p><br>`;
  statsEle.innerHTML += `<p><b>Arcade coins</b><i>${formatNumber(guild.arcadeCoins)}</i></p><br>`;
  statsEle.innerHTML += `<p><b>Combined AP</b><i>${formatNumber(guild.combinedAP)}</i></p><br>`;
  statsEle.innerHTML += `<p><b>Combined Karma</b><i>${formatNumber(guild.karma)}</i></p><br>`;
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
