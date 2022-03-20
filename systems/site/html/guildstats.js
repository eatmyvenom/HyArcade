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
    let wins = `<i>Wins ${formatNumber(m?.stats.arcadeWins ?? 0)}</i>`;

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
    ["Party Games", guild.gameStats.partyGames.wins],
    ["Hypixel Says", guild.gameStats.hypixelSays.wins],
    ["Bounty Hunters", guild.gameStats.bountyHunters.wins],
    ["Hole in the Wall", guild.gameStats.holeInTheWall.wins],
    ["Farm Hunt", guild.gameStats.farmHunt.wins],
    ["Mini Walls", guild.gameStats.miniWalls.wins],
    ["Football", guild.gameStats.football.wins],
    ["Ender Spleef", guild.gameStats.enderSpleef.wins],
    ["Throw Out", guild.gameStats.throwOut.wins],
    ["Galaxy Wars", guild.gameStats.galaxyWars.wins],
    ["Dragon Wars", guild.gameStats.dragonWars.wins],
    ["Blocking Dead", guild.gameStats.blockingDead.wins],
    ["Hide and Seek", guild.gameStats.hideAndSeek.wins],
    ["Zombies", guild.gameStats.zombies.wins],
    ["Pixel Painters", guild.gameStats.pixelPainters.wins],
    ["Seasonal Games", guild.gameStats.seasonal.wins],
  ];

  gamesArr.sort((a, b) => b[1] - a[1]);

  for (const g of gamesArr) {
    gamesEle.innerHTML += `<p><b class="yellow">${g[0]}</b><i class="gray">${formatNumber(g[1])}</i></p><br>`;
  }
}

/**
 *
 * @param {object} guild
 */
function formatStats(guild) {
  const statsEle = document.querySelector(".stats");

  statsEle.innerHTML += `<p><b class="yellow">Guild experience</b><i class="gray">${formatNumber(guild.gexp)}</i></p><br>`;
  statsEle.innerHTML += `<p><b class="yellow">Arcade GXP</b><i class="gray">${formatNumber(guild.arcadeEXP)}</i></p><br>`;
  statsEle.innerHTML += `<p><b class="yellow">Arcade coins</b><i class="gray">${formatNumber(guild.arcadeCoins)}</i></p><br>`;
  statsEle.innerHTML += `<p><b class="yellow">Combined AP</b><i class="gray">${formatNumber(guild.combinedAP)}</i></p><br>`;
  statsEle.innerHTML += `<p><b class="yellow">Combined Karma</b><i class="gray">${formatNumber(guild.karma)}</i></p><br>`;
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
