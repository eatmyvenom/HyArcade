import axios from "axios";
import fs from "fs-extra";
import Requests from "hyarcade-requests";
import Database from "hyarcade-requests/Database.js";
import { Account, Command, CommandResponse } from "hyarcade-structures";
import { createRequire } from "node:module";
import ImageGenerator from "../images/ImageGenerator.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";
import TimeFormatter from "../Utils/Formatting/TimeFormatter.js";

const require = createRequire(import.meta.url);

const { CommandInteraction, Message } = require("discord.js");

/**
 *
 * @param {object} status
 * @returns {string}
 */
function getImage(status) {
  if (!status.session.online) {
    return "assets/status/Main-lobby.png";
  }

  switch (status.session.gameType) {
    case "ARCADE": {
      status.session.gameType = "Arcade";

      switch (status.session.mode) {
        case "LOBBY": {
          status.session.mode = "Lobby";
          return "assets/status/Arcade-lobby-1.png";
        }

        case "PARTY": {
          status.session.mode = "Party Games";
          return "assets/status/Arcade-party-games-1.png";
        }

        case "HOLE_IN_THE_WALL": {
          status.session.mode = "Hole in the Wall";
          return "assets/status/Arcade-hole-in-the-wall-2.png";
        }

        case "THROW_OUT": {
          status.session.mode = "Throw Out";
          return "assets/status/Arcade-throw-out.png";
        }

        case "SOCCER": {
          status.session.mode = "Football";
          return "assets/status/Arcade-football.png";
        }

        case "ONEINTHEQUIVER": {
          status.session.mode = "Bounty Hunters";
          return "assets/status/Arcade-bounty-hunters-2.png";
        }

        case "DRAW_THEIR_THING": {
          status.session.mode = "Pixel Painters";
          return "assets/status/Arcade-pixel-painters.png";
        }

        case "DEFENDER": {
          status.session.mode = "Creeper Attack";
          return "assets/status/Arcade-creeper-attack.png";
        }

        case "DRAGONWARS2": {
          status.session.mode = "Dragon Wars";
          return "assets/status/Arcade-dragon-wars.png";
        }

        case "DAYONE": {
          status.session.mode = "Blocking Dead";
          return "assets/status/Arcade-blocking-dead.png";
        }

        case "STARWARS": {
          status.session.mode = "Galaxy Wars";
          return "assets/status/Arcade-galaxy-wars.png";
        }

        case "SIMON_SAYS": {
          status.session.mode = "Hypixel Says";
          return "assets/status/Arcade-hypixel-says.png";
        }

        case "ENDER": {
          status.session.mode = "Ender Spleef";
          return "assets/status/Arcade-ender-spleef.png";
        }

        case "FARM_HUNT": {
          status.session.mode = "Farm Hunt";

          switch (status.session.map) {
            case "Farm": {
              return "assets/status/Arcade-farm-hunt-4.png";
            }

            case "Meadow": {
              return "assets/status/Arcade-farm-hunt-3.png";
            }

            case "Homestead": {
              return "assets/status/Arcade-farm-hunt-1.png";
            }

            case "Beach Party": {
              return "assets/status/Arcade-farm-hunt-2.png";
            }
          }

          break;
        }

        case "ZOMBIES_DEAD_END": {
          status.session.mode = "Zombies";
          return "assets/status/Arcade-zombies-dead-end.png";
        }

        case "ZOMBIES_BAD_BLOOD": {
          status.session.mode = "Zombies";
          return "assets/status/Arcade-zombies-bad-blood.png";
        }

        case "ZOMBIES_ALIEN_ARCADIUM": {
          status.session.mode = "Zombies";
          return "assets/status/Arcade-zombies-alien-arcadium.png";
        }

        case "HIDE_AND_SEEK_PARTY_POOPER": {
          status.session.mode = "Party Pooper";

          switch (status.session.map) {
            case "Pool Party": {
              return "assets/status/Arcade-party-pooper-pool.png";
            }

            case "House Party": {
              return "assets/status/Arcade-party-pooper-house.png";
            }
          }

          break;
        }

        case "MINI_WALLS": {
          status.session.mode = "Mini Walls";

          return "assets/status/Arcade-mini-walls-babalon.png";
        }

        case "PVP_CTW": {
          status.session.mode = "Capture the Wool";

          switch (status.session.map) {
            case "Quabba": {
              return "assets/status/Arcade-capture-the-wool-5.png";
            }

            case "Amun": {
              return "assets/status/Arcade-capture-the-wool-6.png";
            }

            case "Desert Palace": {
              return "assets/status/Arcade-capture-the-wool-2.png";
            }

            case "Turrets": {
              return "assets/status/Arcade-capture-the-wool-7.png";
            }

            case "Tudor Garden": {
              return "assets/status/Arcade-capture-the-wool-3.png";
            }

            case "Manhattan Showdown": {
              return "assets/status/Arcade-capture-the-wool-8.png";
            }

            default: {
              return "assets/status/Arcade-capture-the-wool-6.png";
            }
          }
        }
      }
      return "assets/status/Arcade-lobby-1.png";
    }

    case "BEDWARS": {
      return "assets/status/Bedwars-lobby.png";
    }

    case "MCGO": {
      status.session.gameType = "Cops and Crims";
      return "assets/status/Cops-lobby.png";
    }

    case "LEGACY": {
      status.session.gameType = "Classic Games";

      switch (status.session.mode) {
        case "VAMPIREZ": {
          switch (status.session.map) {
            case "Plundered": {
              return "assets/status/Classic-vampirez-plundered.png";
            }
            case "Kudong": {
              return "assets/status/Classic-vampirez-kudong.png";
            }
            case "Village": {
              return "assets/status/Classic-vampirez-village.png";
            }
            case "Church": {
              return "assets/status/Classic-vampirez-village.png";
            }
          }

          return "assets/status/Classic-vampirez-kudong.png";
        }

        case "QUAKECRAFT": {
          switch (status.session.map) {
            case "Apex III": {
              return "assets/status/Classic-quake-Apex_III.png";
            }

            case "Ancient": {
              return "assets/status/Classic-quake-Ancient.png";
            }

            case "Fryst": {
              return "assets/status/Classic-quake-Fryst.png";
            }

            case "Cold_War": {
              return "assets/status/Classic-quake-Cold_War.png";
            }

            case "Karunesh": {
              return "assets/status/Classic-quake-Karunesh.png";
            }

            case "Forgotten": {
              return "assets/status/Classic-quake-Forgotten.png";
            }

            case "Sunken": {
              return "assets/status/Classic-quake-Sunken.png";
            }

            case "WoodStone": {
              return "assets/status/Classic-quake-WoodStone.png";
            }

            case "Town": {
              return "assets/status/Classic-quake-Town.png";
            }

            case "Demonic": {
              return "assets/status/Classic-quake-Demonic.png";
            }

            case "Martian": {
              return "assets/status/Classic-quake-Martian.png";
            }

            case "Sero": {
              return "assets/status/Classic-quake-Sero.png";
            }

            case "Faarah": {
              return "assets/status/Classic-quake-Faarah.png";
            }

            case "Lost World": {
              return "assets/status/Classic-quake-Lost_World.png";
            }

            case "DigSite2": {
              return "assets/status/Classic-quake-DigSite2.png";
            }

            case "Mines": {
              return "assets/status/Classic-quake-Mines.png";
            }

            case "Apex II": {
              return "assets/status/Classic-quake-Apex_II.png";
            }

            case "Apex": {
              return "assets/status/Classic-quake-Apex.png";
            }

            case "HustWood": {
              return "assets/status/Classic-quake-HustWood.png";
            }

            case "DigSite": {
              return "assets/status/Classic-quake-DigSite.png";
            }
          }
          return "assets/status/Classic-quake-Apex_III.png";
        }

        case "WALLS": {
          return "assets/status/Classic-walls-Aztec.png";
        }

        case "GINGERBREAD": {
          status.session.mode = "Turbo Kart Racers";
          return "assets/status/Classic-tkr.png";
        }

        case "PAINTBALL": {
          if (fs.existsSync(`assets/status/classic/paintball/${status.session.map}.png`)) {
            return `assets/status/classic/paintball/${status.session.map}.png`;
          }
          break;
        }
      }

      return "assets/status/Classic-lobby.png";
    }

    case "SKYWARS": {
      return "assets/status/Skywars-lobby.png";
    }

    case "MURDER_MYSTERY": {
      return "assets/status/Murder-mystery-lobby.png";
    }

    case "HOUSING": {
      return "assets/status/Housing-lobby.png";
    }

    case "PIT": {
      return "assets/status/Pit.png";
    }

    case "BUILD_BATTLE": {
      return status.session.mode == "LOBBY" ? "assets/status/Build-battle-lobby.png" : "assets/status/Build-battle.png";
    }

    case "DUELS": {
      switch (status.session.mode) {
        case "DUELS_SUMO_DUEL": {
          status.session.mode = "Sumo";

          if (fs.existsSync(`assets/status/duels/sumo/${status.session.map}.png`)) {
            return `assets/status/duels/sumo/${status.session.map}.png`;
          }
          break;
        }
      }

      return "assets/status/Duels-lobby-new.png";
    }

    case "SPEED_UHC":
    case "UHC": {
      return "assets/status/UHC-lobby.png";
    }

    case "TNTGAMES": {
      status.session.gameType = "Tnt Games";
      switch (status.session.mode) {
        case "TNTRUN": {
          status.session.mode = "TNT Run";

          if (fs.existsSync(`assets/status/tnt/run/${status.session.map}.png`)) {
            return `assets/status/tnt/run/${status.session.map}.png`;
          }
          break;
        }

        case "PVPRUN": {
          status.session.mode = "PVP Run";

          if (fs.existsSync(`assets/status/tnt/run/${status.session.map}.png`)) {
            return `assets/status/tnt/run/${status.session.map}.png`;
          }
        }
      }
      return "assets/status/Tnt-lobby.png";
    }

    case "WALLS3": {
      status.session.gameType = "Mega Walls";
      return "assets/status/Mega-walls-lobby.png";
    }

    case "SUPER_SMASH": {
      status.session.gameType = "Smash heros";
      return "assets/status/Smash-heros-lobby.png";
    }

    case "BATTLEGROUND": {
      status.session.gameType = "Warlords";
      return "assets/status/Warloads-lobby.png";
    }

    case "MAIN": {
      return "assets/status/Normal-lobby.png";
    }

    case "TOURNAMENT": {
      return "assets/status/Tourney-lobby.png";
    }

    case "SURVIVAL_GAMES": {
      status.session.gameType = "Blitz";
      return "assets/status/Blitz-lobby.png";
    }

    case "SKYBLOCK": {
      return "assets/status/Skyblock-hub.png";
    }

    case "PROTOTYPE": {
      return "assets/status/Prototype-lobby.png";
    }
  }

  return "assets/status/Main-lobby.png";
}

/**
 * @param {Account} acc
 * @returns {string}
 */
function lastSeen(acc) {
  if (acc.isLoggedIn) {
    return "right now";
  }

  if (acc.lastLogout == 0) {
    return "Hidden";
  }

  return TimeFormatter(acc.lastLogout);
}

/**
 * @param {Account} acc
 * @returns {string}
 */
function loggedIn(acc) {
  if (acc.lastLogin == 0) {
    return "Hidden";
  }

  return TimeFormatter(acc.lastLogin);
}

/**
 * @param status
 */
function classicGamesTransformer(status) {
  switch (status.session.gameType) {
    case "VAMPIREZ": {
      status.session.gameType = "LEGACY";
      status.session.mode = "VAMPIREZ";
      break;
    }

    case "WALLS": {
      status.session.gameType = "LEGACY";
      status.session.mode = "WALLS";
      break;
    }

    case "GINGERBREAD": {
      status.session.gameType = "LEGACY";
      status.session.mode = "GINGERBREAD";
      break;
    }

    case "PAINTBALL": {
      status.session.gameType = "LEGACY";
      status.session.mode = "PAINTBALL";
      break;
    }

    case "ARENA": {
      status.session.gameType = "LEGACY";
      status.session.mode = "ARENA";
      break;
    }

    case "QUAKECRAFT": {
      status.session.gameType = "LEGACY";
      status.session.mode = "QUAKECRAFT";
      break;
    }
  }
}

/**
 * @param {Account} account
 * @returns {string}
 */
async function getLastAction(account) {
  const friendDataReq = await axios.get(`https://api.slothpixel.me/api/players/${account.uuid}/friends`);
  const friendData = friendDataReq.data;

  let friendTimestamps = friendData.error ? [] : Object.values(friendData).map(f => f.started);

  const time = Math.max(account.actionTime.quest.time, account.actionTime.pets, account.actionTime.dailyReward, account.actionTime.otherActions, ...friendTimestamps);
  return TimeFormatter(time);
}

/**
 * @param {Account} account
 * @returns {object}
 */
async function getGEXP(account) {
  const guildRequest = await axios.get(`https://api.slothpixel.me/api/guilds/${account.uuid}`);
  const guildData = guildRequest.data;

  if (!guildData.guild) {
    return { daily: "N/A", weekly: "N/A" };
  }

  const accountData = guildData.members.find(acc => acc.uuid == account.uuid);
  return { daily: Object.values(accountData.exp_history)[0], weekly: Object.values(accountData.exp_history).reduce((p, i) => p + i) };
}

/**
 * @param {string[]} args
 * @param {Message} rawmsg
 * @param {CommandInteraction} interaction
 * @returns {CommandResponse}
 */
async function callback(args, rawmsg, interaction) {
  /**
   * @type {Account}
   */
  let acc;

  if (interaction != undefined) {
    await interaction.deferReply();
    acc = await Database.account(interaction.options.getString("player"), interaction.user.id);
    if (acc == undefined) {
      return new CommandResponse("", ERROR_UNLINKED);
    }
  } else {
    acc = await Database.account(args[0], rawmsg.author.id);
  }

  const status = await Requests.HypixelApi.status(acc.uuid);

  const stsJSON = JSON.stringify(status, undefined, 2);

  const img = new ImageGenerator(1280, 800, "'myFont'", true);

  const startY = 200;
  const increase = 50;
  const spacer = 40;

  let y = startY;
  if (status.session.online) {
    const counts = await Requests.HypixelApi.counts();

    classicGamesTransformer(status);

    const modeOthers = counts?.games?.[status.session.gameType]?.modes?.[status.session.mode] ?? "Unknown";
    const typeOthers = counts?.games?.[status.session.gameType]?.players ?? "Unknown";

    await img.addBackground(getImage(status), 0, 0, 1280, 800, "#0000004F");

    const type = `${status.session.gameType}`.replace(/_/g, " ").trim();
    const mode = `${status.session.mode}`.replace(/_/g, " ").replace(type, "").trim();

    let modeName = `${mode.slice(0, 1).toUpperCase()}${mode.slice(1).toLowerCase()}`;
    let typeName = `${type.slice(0, 1).toUpperCase()}${type.slice(1).toLowerCase()}`;

    await img.drawMcText("Player Status", img.canvas.width / 2, 40, 56, "center");
    await img.drawMcText(ImageGenerator.formatAcc(acc, true), img.canvas.width / 2, 100, 56, "center");

    await img.drawMcText("&aType", 300, (y += increase), 42, "center");
    await img.drawMcText(`&a${typeName}`, 300, (y += increase), 50, "center");

    y += spacer;

    await img.drawMcText("&bMode", 300, (y += increase), 42, "center");
    await img.drawMcText(`&b${modeName}`, 300, (y += increase), 50, "center");

    y += spacer;

    await img.drawMcText("&eMap Name", 300, (y += increase), 42, "center");
    await img.drawMcText(`&e${status.session.map ?? modeName}`, 300, (y += increase), 50, "center");

    y += spacer;

    await img.drawMcText("&aLogin Time", 300, (y += increase), 42, "center");
    await img.drawMcText(`&a${loggedIn(acc)}`, 300, (y += increase), 50, "center");

    y = startY;

    await img.drawMcText(`&a${typeName} players`, img.canvas.width - 300, (y += increase), 42, "center");
    await img.drawMcText(`&a${typeOthers}`, img.canvas.width - 300, (y += increase), 50, "center");

    y += spacer;

    if (status.session.mode != undefined && status.session.mode != "LOBBY") {
      await img.drawMcText(`&b${modeName} players`, img.canvas.width - 300, (y += increase), 42, "center");
      await img.drawMcText(`&b${modeOthers}`, img.canvas.width - 300, (y += increase), 50, "center");
    }
  } else {
    await img.addBackground(getImage(status), 0, 0, 1280, 800, "#0000008F");
    await img.drawMcText("Player Status", img.canvas.width / 2, 40, 56, "center");
    await img.drawMcText(ImageGenerator.formatAcc(acc, true), img.canvas.width / 2, 100, 56, "center");

    await img.drawMcText("&aLast Logout", 300, (y += increase), 42, "center");
    await img.drawMcText(`&a${lastSeen(acc)}`, 300, (y += increase), 50, "center");

    y += spacer + increase + increase + spacer;

    let game = acc.mostRecentGameType;
    game = `${game.slice(0, 1).toUpperCase()}${game.slice(1).toLowerCase()}`.replace(/_/g, " ");

    await img.drawMcText("&bLast Mode", 300, (y += increase), 42, "center");
    await img.drawMcText(`&b${game}`, 300, (y += increase), 50, "center");

    if (acc.apiHidden) {
      y = startY;

      await img.drawMcText(`&aLast Known Action`, img.canvas.width - 300, (y += increase), 42, "center");
      await img.drawMcText(`&a${await getLastAction(acc)}`, img.canvas.width - 300, (y += increase), 50, "center");
      y += spacer;

      const gexp = await getGEXP(acc);

      await img.drawMcText(`&bDaily GEXP`, img.canvas.width - 300, (y += increase), 42, "center");
      await img.drawMcText(`&b${gexp.daily}`, img.canvas.width - 300, (y += increase), 50, "center");

      y += spacer;

      await img.drawMcText("&eWeekly GEXP", img.canvas.width - 300, (y += increase), 42, "center");
      await img.drawMcText(`&e${gexp.weekly}`, img.canvas.width - 300, (y += increase), 50, "center");
    }
  }

  return new CommandResponse(`\`\`\`${stsJSON}\`\`\``, undefined, img.toDiscord());
}

export default new Command(["status", "sts"], ["*"], callback, 10000);
