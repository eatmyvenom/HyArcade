const {
  MessageEmbed,
  User
} = require("discord.js");
const Account = require("hyarcade-requests/types/Account");
const EmojiGetter = require("../Formatting/EmojiGetter");

/**
 * @param {number} n
 * @returns {number}
 */
function formatR (n) {
  const r = (Math.round(n * 100) / 100) ?? 0.0;
  return r;
}

/**
 * @param {string} str
 * @returns {number}
 */
function numberify (str) {
  return Number((`${str}`).replace(/undefined/g, 0).replace(/null/g, 0));
}

/**
 * @param {number} number
 * @returns {number}
 */
function formatNum (number) {
  return Intl.NumberFormat("en").format(number);
}

module.exports = class AdvancedEmbeds {
  /**
   * 
   * @param {Account} acc1
   * @param {Account} acc2
   * @param {string} game
   * @param {boolean} hasPerms
   * @returns {MessageEmbed}
   */
  static compareStats (acc1, acc2, game, hasPerms) {
    const embed = new MessageEmbed().setTitle(`${acc1.name} vs ${acc2.name}`)
      .setColor(0xbb00dd);

    let side1 = "";
    let side2 = "";

    switch(game.toLowerCase()) {
    case "12":
    case "party":
    case "partygames":
    case "pg": {
      if(acc1.wins > acc2.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**Party games wins**\n${formatNum(numberify(acc1.partyGames.wins))}`;
      side2 += `**Party games wins**\n${formatNum(numberify(acc2.partyGames.wins))}`;
      break;
    }

    case "fh":
    case "farm":
    case "fmhnt":
    case "farmhunt":
    case "5":
    case "frmhnt": {
      if(acc1.farmhunt.wins > acc2.farmhunt.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**Farm hunt wins**\n${formatNum(numberify(acc1.farmhunt.wins))}\n`;
      side2 += `**Farm hunt wins**\n${formatNum(numberify(acc2.farmhunt.wins))}\n`;

      if(acc1.farmhunt.poop > acc2.farmhunt.poop) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Farm hunt poop**\n${formatNum(numberify(acc1.farmhunt.poop))}`;
      side2 += `**Farm hunt poop**\n${formatNum(numberify(acc2.farmhunt.poop))}`;
      break;
    }
    case "10":
    case "hs":
    case "hys":
    case "hypixel":
    case "says":
    case "hysays": {
      if(acc1.hypixelSays.wins > acc2.hypixelSays.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Hypixel says wins**\n${formatNum(numberify(acc1.hypixelSays.wins))}\n`;
      side2 += `**Hypixel says wins**\n${formatNum(numberify(acc2.hypixelSays.wins))}\n`;

      if(acc1.hypixelSays.rounds > acc2.hypixelSays.rounds) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Hypixel says Rounds**\n${formatNum(numberify(acc1.hypixelSays.rounds))}`;
      side2 += `**Hypixel says Rounds**\n${formatNum(numberify(acc2.hypixelSays.rounds))}`;
      break;
    }

    case "8":
    case "hitw":
    case "hit":
    case "hole":
    case "pain": {
      if(acc1.holeInTheWall.wins > acc2.holeInTheWall.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**HITW wins**\n${formatNum(numberify(acc1.holeInTheWall.wins))}\n`;
      side2 += `**HITW wins**\n${formatNum(numberify(acc2.holeInTheWall.wins))}\n`;

      if(acc1.holeInTheWall.qualifers > acc2.holeInTheWall.qualifers) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**HITW qualifiers**\n${formatNum(numberify(acc1.holeInTheWall.qualifers))}\n`;
      side2 += `**HITW qualifiers**\n${formatNum(numberify(acc2.holeInTheWall.qualifers))}\n`;

      if(acc1.holeInTheWall.finals > acc2.holeInTheWall.finals) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**HITW finals**\n${formatNum(numberify(acc1.holeInTheWall.finals))}\n`;
      side2 += `**HITW finals**\n${formatNum(numberify(acc2.holeInTheWall.finals))}\n`;

      if(acc1.holeInTheWall.rounds > acc2.holeInTheWall.rounds) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**HITW walls**\n${formatNum(numberify(acc1.holeInTheWall.rounds))}`;
      side2 += `**HITW walls**\n${formatNum(numberify(acc2.holeInTheWall.rounds))}`;
      break;
    }

    case "11":
    case "mw":
    case "miw":
    case "mini":
    case "mwall":
    case "wall":
    case "pvp":
    case "miniwalls": {
      if(acc1.miniWalls.wins > acc2.miniWalls.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**Mini walls wins**\n${formatNum(numberify(acc1.miniWalls.wins))}\n`;
      side2 += `**Mini walls wins**\n${formatNum(numberify(acc2.miniWalls.wins))}\n`;

      if(acc1.miniWalls.kills > acc2.miniWalls.kills) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Mini walls kills**\n${formatNum(numberify(acc1.miniWalls.kills))}\n`;
      side2 += `**Mini walls kills**\n${formatNum(numberify(acc2.miniWalls.kills))}\n`;

      if(acc1.miniWalls.finalKills > acc2.miniWalls.finalKills) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Mini walls finals**\n${formatNum(numberify(acc1.miniWalls.finalKills))}\n`;
      side2 += `**Mini walls finals**\n${formatNum(numberify(acc2.miniWalls.finalKills))}\n`;

      if(acc1.miniWalls.witherDamage > acc2.miniWalls.witherDamage) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Mini walls wither damage**\n${formatNum(numberify(acc1.miniWalls.witherDamage))}\n`;
      side2 += `**Mini walls wither damage**\n${formatNum(numberify(acc2.miniWalls.witherDamage))}\n`;

      if(acc1.miniWalls.witherKills > acc2.miniWalls.witherKills) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Mini walls wither kills**\n${formatNum(numberify(acc1.miniWalls.witherKills))}\n`;
      side2 += `**Mini walls wither kills**\n${formatNum(numberify(acc2.miniWalls.witherKills))}\n`;

      if(acc1.miniWalls.deaths > acc2.miniWalls.deaths) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Mini walls deaths**\n${formatNum(numberify(acc1.miniWalls.deaths))}`;
      side2 += `**Mini walls deaths**\n${formatNum(numberify(acc2.miniWalls.deaths))}`;

      break;
    }

    case "6":
    case "sc":
    case "fb":
    case "foot":
    case "ballin":
    case "fuck":
    case "shit":
    case "football": {
      if(acc1.football.wins > acc2.football.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Football wins**\n${formatNum(numberify(acc1.football.wins))}\n`;
      side2 += `**Football wins**\n${formatNum(numberify(acc2.football.wins))}\n`;

      if(acc1.football.goals > acc2.football.goals) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Football goals**\n${formatNum(numberify(acc1.football.goals))}\n`;
      side2 += `**Football goals**\n${formatNum(numberify(acc2.football.goals))}\n`;

      if(acc1.football.powerkicks > acc2.football.powerkicks) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Football power kicks**\n${formatNum(numberify(acc1.football.powerkicks))}\n`;
      side2 += `**Football power kicks**\n${formatNum(numberify(acc2.football.powerkicks))}\n`;

      if(acc1.football.kicks > acc2.football.kicks) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Football kicks**\n${formatNum(numberify(acc1.football.kicks))}`;
      side2 += `**Football kicks**\n${formatNum(numberify(acc2.football.kicks))}`;
      break;
    }

    case "4":
    case "es":
    case "spleeg":
    case "ender":
    case "enderman":
    case "trash":
    case "enderspleef": {
      if(acc1.enderSpleef.wins > acc2.enderSpleef.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**Ender spleef wins**\n${formatNum(numberify(acc1.enderSpleef.wins))}`;
      side2 += `**Ender spleef wins**\n${formatNum(numberify(acc2.enderSpleef.wins))}`;
      break;
    }

    case "15":
    case "to":
    case "throw":
    case "toss":
    case "sumo2":
    case "throwout": {
      if(acc1.throwOut.wins > acc2.throwOut.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Throw out wins**\n${formatNum(numberify(acc1.throwOut.kills))}\n`;
      side2 += `**Throw out wins**\n${formatNum(numberify(acc2.throwOut.kills))}\n`;

      if(acc1.throwOut.kills > acc2.throwOut.kills) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Throw out kills**\n${formatNum(numberify(acc1.throwOut.kills))}\n`;
      side2 += `**Throw out kills**\n${formatNum(numberify(acc2.throwOut.kills))}\n`;

      if(acc1.throwOut.deaths > acc2.throwOut.deaths) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Throw out deaths**\n${formatNum(numberify(acc1.throwOut.deaths))}`;
      side2 += `**Throw out deaths**\n${formatNum(numberify(acc2.throwOut.deaths))}`;

      break;
    }

    case "7":
    case "gw":
    case "sw":
    case "galaxy":
    case "galaxywars": {
      if(acc1.galaxyWars.wins > acc2.galaxyWars.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Galaxy wars wins**\n${formatNum(numberify(acc1.galaxyWars.wins))}\n`;
      side2 += `**Galaxywars wins**\n${formatNum(numberify(acc2.galaxyWars.wins))}\n`;

      if(acc1.galaxyWars.kills > acc2.galaxyWars.kills) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Galaxy wars kills**\n${formatNum(numberify(acc1.galaxyWars.kills))}\n`;
      side2 += `**Galaxy wars kills**\n${formatNum(numberify(acc2.galaxyWars.kills))}\n`;

      if(acc1.galaxyWars.deaths > acc2.galaxyWars.deaths) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Galaxy wars deaths**\n${formatNum(numberify(acc1.galaxyWars.deaths))}`;
      side2 += `**Galaxy wars deaths**\n${formatNum(numberify(acc2.galaxyWars.deaths))}`;

      break;
    }

    case "3":
    case "dw":
    case "dragon":
    case "wagon":
    case "dragonwar":
    case "dragwar":
    case "dragonwars": {
      if(acc1.dragonWars.wins > acc2.dragonWars.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Dragon wars wins**\n${formatNum(numberify(acc1.dragonWars.wins))}\n`;
      side2 += `**Dragon wars wins**\n${formatNum(numberify(acc2.dragonWars.wins))}\n`;

      if(acc1.dragonWars.kills > acc2.dragonWars.kills) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Dragon wars kills**\n${formatNum(numberify(acc1.dragonWars.kills))}`;
      side2 += `**Dragon wars kills**\n${formatNum(numberify(acc2.dragonWars.kills))}`;

      break;
    }

    case "2":
    case "bh":
    case "bnt":
    case "one":
    case "bounty":
    case "oneinthequiver":
    case "bountyhunters": {
      if(acc1.bountyHunters.wins > acc2.bountyHunters.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Bounty hunters wins**\n${formatNum(numberify(acc1.bountyHunters.wins))}\n`;
      side2 += `**Bounty hunters wins**\n${formatNum(numberify(acc2.bountyHunters.wins))}\n`;

      if(acc1.bountyHunters.kills > acc2.bountyHunters.kills) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Bounty hunters kills**\n${formatNum(numberify(acc1.bountyHunters.kills))}\n`;
      side2 += `**Bounty hunters kills**\n${formatNum(numberify(acc2.bountyHunters.kills))}\n`;

      if(acc1.bountyHunters.deaths > acc2.bountyHunters.deaths) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Bounty hunters deaths**\n${formatNum(numberify(acc1.bountyHunters.deaths))}`;
      side2 += `**Bounty hunters deaths**\n${formatNum(numberify(acc2.bountyHunters.deaths))}`;

      break;
    }

    case "1":
    case "bd":
    case "do":
    case "dayone":
    case "blocking":
    case "blockingdead": {
      if(acc1.blockingDead.wins > acc2.blockingDead.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Blocking dead wins**\n${formatNum(numberify(acc1.blockingDead.wins))}\n`;
      side2 += `**Blocking dead wins**\n${formatNum(numberify(acc2.blockingDead.wins))}\n`;

      if(acc1.blockingDead.kills > acc2.blockingDead.kills) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Blocking dead kills**\n${formatNum(numberify(acc1.blockingDead.kills))}\n`;
      side2 += `**Blocking dead kills**\n${formatNum(numberify(acc2.blockingDead.kills))}\n`;

      if(acc1.blockingDead.headshots > acc2.blockingDead.headshots) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Blocking dead headshots**\n${formatNum(numberify(acc1.blockingDead.headshots))}`;
      side2 += `**Blocking dead headshots**\n${formatNum(numberify(acc2.blockingDead.headshots))}`;

      break;
    }

    case "9":
    case "has":
    case "hide":
    case "h&s":
    case "hns":
    case "probotkeptspammingthisshit":
    case "hideandseek":
    case "hidenseek":
    case "hideseek": {
      if(acc1.hideAndSeek.wins > acc2.hideAndSeek.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Hide and seek wins**\n${formatNum(numberify(acc1.hideAndSeek.wins))}\n`;
      side2 += `**Hide and seek wins**\n${formatNum(numberify(acc2.hideAndSeek.wins))}\n`;

      if(acc1.hideAndSeek.kills > acc2.hideAndSeek.kills) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Hide and seek kills**\n${formatNum(numberify(acc1.hideAndSeek.kills))}\n`;
      side2 += `**Hide and seek kills**\n${formatNum(numberify(acc2.hideAndSeek.kills))}\n`;

      if(acc1.hideAndSeek.seekerWins > acc2.hideAndSeek.seekerWins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Hide and seek seeker wins**\n${formatNum(numberify(acc1.hideAndSeek.seekerWins))}\n`;
      side2 += `**Hide and seek seeker wins**\n${formatNum(numberify(acc2.hideAndSeek.seekerWins))}\n`;

      if(acc1.hideAndSeek.hiderWins > acc2.hideAndSeek.hiderWins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**Hide and seek hider wins**\n${formatNum(numberify(acc1.hideAndSeek.hiderWins))}`;
      side2 += `**Hide and seek hider wins**\n${formatNum(numberify(acc2.hideAndSeek.hiderWins))}`;

      break;
    }

    case "16":
    case "z":
    case "zs":
    case "zbs":
    case "zomb":
    case "zbies":
    case "zombies": {
      if(acc1.zombies.wins_zombies > acc2.zombies.wins_zombies) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**Zombies wins**\n${formatNum(numberify(acc1.zombies.wins_zombies))}`;
      side2 += `**Zombies wins**\n${formatNum(numberify(acc2.zombies.wins_zombies))}`;
      break;
    }

    case "ctw":
    case "ctwool":
    case "capkills":
    case "capture":
    case "capwool":
    case "ctwwool":
    case "ctwwoolcaptured":
    case "ctwkills": {
      if(acc1.captureTheWool.kills > acc2.captureTheWool.kills) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**CTW kills**\n${formatNum(numberify(acc1.captureTheWool.kills))}\n`;
      side2 += `**CTW kills**\n${formatNum(numberify(acc2.captureTheWool.kills))}\n`;

      if(acc1.captureTheWool.woolCaptures > acc2.captureTheWool.woolCaptures) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }

      side1 += `**CTW wool captured**\n${formatNum(numberify(acc1.captureTheWool.woolCaptures))}`;
      side2 += `**CTW wool captured**\n${formatNum(numberify(acc2.captureTheWool.woolCaptures))}`;

      break;
    }

    case "13":
    case "pp":
    case "draw":
    case "pixpaint":
    case "pixelpaint":
    case "pixelpainters":
    case "drawmything":
    case "drawtheirthing":
    case "drawing": {
      if(acc1.pixelPainters.wins > acc2.pixelPainters.wins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**Pixel painter wins**\n${formatNum(numberify(acc1.pixelPainters.wins))}`;
      side2 += `**Pixel painter wins**\n${formatNum(numberify(acc2.pixelPainters.wins))}`;

      break;
    }

    default : {
      if(acc1.arcadeWins > acc2.arcadeWins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**Arcade wins**\n${formatNum(numberify(acc1.arcadeWins))}`;
      side2 += `**Arcade wins**\n${formatNum(numberify(acc2.arcadeWins))}`;

      if(acc1.arcadeCoins > acc2.arcadeCoins) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**Arcade coins**\n${formatNum(numberify(acc1.arcadeCoins))}`;
      side2 += `**Arcade coins**\n${formatNum(numberify(acc2.arcadeCoins))}`;

      if(acc1.achievementPoints > acc2.achievementPoints) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**Arcade coins**\n${formatNum(numberify(acc1.achievementPoints))}`;
      side2 += `**Arcade coins**\n${formatNum(numberify(acc2.achievementPoints))}`;

      if(acc1.karma > acc2.karma) {
        side1 += ` ${EmojiGetter(hasPerms, "better")} `;
        side2 += ` ${EmojiGetter(hasPerms, "worse")} `;
      } else {
        side2 += ` ${EmojiGetter(hasPerms, "better")} `;
        side1 += ` ${EmojiGetter(hasPerms, "worse")} `;
      }
      side1 += `**Arcade coins**\n${formatNum(numberify(acc1.karma))}`;
      side2 += `**Arcade coins**\n${formatNum(numberify(acc2.karma))}`;

    }
    }

    embed.addField(acc1.name, side1, true);
    embed.addField(acc2.name, side2, true);

    return embed;
  }

  static async getStats (acc, game, hasPerms = false) {
    const thumbURL = `https://crafatar.com/renders/head/${acc.uuid}?overlay&time=${Date.now()}`;

    let lvl = Math.round(acc.level * 100) / 100;
    lvl = `${lvl}`;
    let gamename = "";
    let title = "";

    const fields = [];

    switch(game.toLowerCase()) {
    case "12":
    case "party":
    case "partygames":
    case "pg": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.partyGames.wins)),
        inline: true,
      });
      gamename = "pg";
      title = "Party games";
      break;
    }

    case "fh":
    case "farm":
    case "fmhnt":
    case "farmhunt":
    case "5":
    case "frmhnt": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.farmhunt.wins)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "poop")} poop collected`,
        value: formatNum(numberify(acc.farmhunt.poop)),
        inline: true,
      });
      title = "Farm hunt";
      gamename = "fh";
      break;
    }

    case "10":
    case "hs":
    case "hys":
    case "hypixel":
    case "says":
    case "hysays": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.hypixelSays.wins)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "game")} rounds`,
        value: formatNum(numberify(acc.hypixelSays.rounds)),
        inline: true,
      });
      title = "Hypixel says";
      gamename = "hs";
      break;
    }

    case "8":
    case "hitw":
    case "hit":
    case "hole":
    case "pain": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.holeInTheWall.wins)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "skill")} Qualifers`,
        value: `${acc.holeInTheWall.qualifers}`,
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "skill")} Finals`,
        value: `${acc.holeInTheWall.finals}`,
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "skill2")} Q+F`,
        value: `${acc.holeInTheWall.qualifiers + acc.holeInTheWall.finals}`,
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "game")} Rounds`,
        value: formatNum(numberify(acc.holeInTheWall.rounds)),
        inline: true,
      });
      title = "Hole in the wall";
      gamename = "hitw";
      break;
    }

    case "11":
    case "mw":
    case "miw":
    case "mini":
    case "mwall":
    case "wall":
    case "pvp":
    case "miniwalls": {
      // <br>
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.miniWalls.wins)),
        inline: true,
      });

      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Kills`,
        value: formatNum(numberify(acc.miniWalls.kills)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "bow")} Arrows shot`,
        value: formatNum(numberify(acc.miniWalls.arrowsShot)),
        inline: true,
      });

      fields.push({
        name: `${EmojiGetter(hasPerms, "bow")} Arrows hit`,
        value: formatNum(numberify(acc.miniWalls.arrowsHit)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Final kills`,
        value: formatNum(numberify(acc.miniWalls.finalKills)),
        inline: true,
      });

      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Wither kills`,
        value: formatNum(numberify(acc.miniWalls.witherKills)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Wither damage`,
        value: formatNum(numberify(acc.miniWalls.witherDamage)),
        inline: true,
      });

      fields.push({
        name: `${EmojiGetter(hasPerms, "death")} Deaths`,
        value: formatNum(numberify(acc.miniWalls.deaths)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} KDR`,
        value: `${formatR((acc.miniWalls?.kills + acc?.miniWalls?.finalKills) / acc.miniWalls?.deaths)}`,
        inline: true,
      });
      title = "Mini walls";
      gamename = "mw";
      break;
    }

    case "6":
    case "sc":
    case "fb":
    case "foot":
    case "ballin":
    case "fuck":
    case "shit":
    case "football": {
      // <br>
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.football.wins)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "goal")} Goals`,
        value: formatNum(numberify(acc.football.goals)),
        inline: true,
      });

      // <br>
      fields.push({
        name: `${EmojiGetter(hasPerms, "shoe")} Power kicks`,
        value: formatNum(numberify(acc.football.powerkicks)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "shoe")} Kicks`,
        value: formatNum(numberify(acc.football.kicks)),
        inline: true,
      });
      title = "Football";
      gamename = "fb";
      break;
    }

    case "4":
    case "es":
    case "endspleef":
    case "spleef":
    case "endermanspleef":
    case "anriespleef":
    case "spleeg":
    case "ender":
    case "enderman":
    case "trash":
    case "enderspleef": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.enderSpleef.wins)),
        inline: true,
      });
      title = "Ender spleef";
      gamename = "es";
      break;
    }

    case "15":
    case "to":
    case "throw":
    case "toss":
    case "sumo2":
    case "throwout": {
      // <br>
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.throwOut.wins)),
        inline: true,
      });
      // <br>
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Kills`,
        value: formatNum(numberify(acc.throwOut.kills)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "death")} Deaths`,
        value: formatNum(numberify(acc.throwOut.deaths)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} KDR`,
        value: `${Math.round((acc.throwOut.kills / acc.throwOut.deaths) * 100) / 100}`,
        inline: true,
      });
      title = "Throw out";
      gamename = "to";
      break;
    }

    case "7":
    case "gw":
    case "sw":
    case "galaxy":
    case "galaxywars": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.galaxyWars.wins)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Kills`,
        value: formatNum(numberify(acc.galaxyWars.kills)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "death")} Deaths`,
        value: formatNum(numberify(acc.galaxyWars.deaths)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} KDR`,
        value: `${Math.round((acc.galaxyWars.kills / acc.galaxyWars.deaths) * 100) / 100}`,
        inline: true,
      });
      title = "Galaxy wars";
      gamename = "gw";
      break;
    }

    case "3":
    case "dw":
    case "dragon":
    case "dragonwars": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.dragonWars.wins)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Kills`,
        value: formatNum(numberify(acc.dragonWars.kills)),
        inline: true,
      });
      title = "Dragon wars";
      gamename = "dw";
      break;
    }

    case "2":
    case "bh":
    case "bnt":
    case "one":
    case "bounty":
    case "oneinthequiver":
    case "bountyhunters": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.bountyHunters.wins)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Kills`,
        value: formatNum(numberify(acc.bountyHunters.kills)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "death")} Deaths`,
        value: formatNum(numberify(acc.bountyHunters.deaths)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} KDR`,
        value: `${Math.round((acc.bountyHunters.kills / acc.bountyHunters.deaths) * 100) / 100}`,
        inline: true,
      });
      title = "Bounty hunters";
      gamename = "bh";
      break;
    }

    case "1":
    case "bd":
    case "do":
    case "dayone":
    case "blocking":
    case "blockingdead": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.blockingDead.wins)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Kills`,
        value: formatNum(numberify(acc.blockingDead.kills)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "headshot")} Headshots`,
        value: formatNum(numberify(acc.blockingDead.headshots)),
        inline: true,
      });
      title = "Blocking dead";
      gamename = "bd";
      break;
    }

    case "9":
    case "has":
    case "hide":
    case "h&s":
    case "hns":
    case "probotkeptspammingthisshit":
    case "hideandseek":
    case "hidenseek":
    case "hideseek": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.hideAndSeek.wins)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Kills`,
        value: formatNum(numberify(acc.hideAndSeek.kills)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Seeker wins`,
        value: formatNum(numberify(acc.hideAndSeek.seekerWins)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "blind")} Hider wins`,
        value: formatNum(numberify(acc.hideAndSeek.hiderWins)),
        inline: true,
      });
      title = "Hide and seek";
      gamename = "hns";
      break;
    }

    case "16":
    case "z":
    case "zs":
    case "zbs":
    case "zomb":
    case "zbies":
    case "zombies": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.zombies.wins_zombies)),
        inline: true,
      });
      title = "Zombies";
      gamename = "z";
      break;
    }

    case "ctw":
    case "ctwool":
    case "capkills":
    case "capture":
    case "capwool":
    case "ctwwool":
    case "ctwwoolcaptured":
    case "ctwkills": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "pvp")} Kills`,
        value: formatNum(numberify(acc.captureTheWool.kills)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "goal")} Captures`,
        value: formatNum(numberify(acc.captureTheWool.woolCaptures)),
        inline: true,
      });
      title = "Capture the wool";
      gamename = "ctw";
      break;
    }

    case "13":
    case "pp":
    case "draw":
    case "pixpaint":
    case "pixelpaint":
    case "pixelpainters":
    case "drawmything":
    case "drawtheirthing":
    case "drawing": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Wins`,
        value: formatNum(numberify(acc.pixelPainters.wins)),
        inline: true,
      });
      title = "Pixel painters";
      gamename = "pp";
      break;
    }

    case "sim":
    case "simulator":
    case "seasonal":
    case "season":
    case "14":
    case "sea": {
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Easter wins`,
        value: `${acc.seasonalWins.easter}`,
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Scuba wins`,
        value: `${acc.seasonalWins.scuba}`,
        inline: true,
      });

      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Halloween wins`,
        value: `${acc.seasonalWins.halloween}`,
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Grinch wins`,
        value: `${acc.seasonalWins.grinch}`,
        inline: true,
      });

      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Total wins`,
        value: `${acc.seasonalWins.total}`,
        inline: true,
      });
      gamename = "sim";
      title = "Seasonal Games";
      break;
    }

    default: {
      fields.push({
        name: `${EmojiGetter(hasPerms, "ap")} Level`,
        value: lvl,
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} All hypixel wins`,
        value: formatNum(numberify(acc.anyWins)),
        inline: true,
      });
      //
      fields.push({
        name: `${EmojiGetter(hasPerms, "win")} Arcade wins`,
        value: formatNum(numberify(acc.arcadeWins)),
        inline: true,
      });

      fields.push({
        name: `${EmojiGetter(hasPerms, "coin")} Arcade Coins`,
        value: formatNum(numberify(acc.arcadeCoins)),
        inline: true,
      });
      //
      fields.push({
        name: `${EmojiGetter(hasPerms, "ap")} AP`,
        value: formatNum(numberify(acc.achievementPoints)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "positive")} Karma`,
        value: formatNum(numberify(acc.karma)),
        inline: true,
      });
      fields.push({
        name: `${EmojiGetter(hasPerms, "id")} UUID`,
        value: acc.uuid,
        inline: true,
      });
      gamename = "arc";
      title = "Overall";
      break;
    }
    }

    let rank = (`${acc.rank}`)
      .replace(/_/g, "")
      .replace(/PLUS/g, "+")
      .replace(/undefined/g, "");
    rank = rank == "" ? "" : `[${rank}]`;

    const embed = new MessageEmbed()
      .setTitle(`:mag_right: ${title} stats`)
      .setAuthor(`${rank} ${acc.name}`, null, `https://hyarcade.xyz/player.html?q=${acc.name}`)
      .setThumbnail(thumbURL)
      .setColor(0x44a3e7)
      .addFields(fields);

    return {
      res: "",
      embed,
      game: gamename
    };
  }

  /**
   * 
   * @param {string} ign 
   * @param {User} user 
   * @returns {MessageEmbed}
   */
  static playerLink (ign, user) {
    const embed = new MessageEmbed()
      .setTitle("Success")
      .setColor(0x00cc66)
      .setDescription(`<@${user.id}> was linked as ${ign}`)
      .setFooter(`${user.id}`);

    return embed;
  }
};
