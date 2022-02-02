import Requests from "hyarcade-requests";
import Database from "hyarcade-requests/Database.js";
import Account from "hyarcade-requests/types/Account.js";
import Command from "hyarcade-structures/Discord/Command.js";
import CommandResponse from "hyarcade-structures/Discord/CommandResponse.js";
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
    return "resources/status/Main-lobby.png";
  }

  switch (status.session.gameType) {
    case "ARCADE": {
      status.session.gameType = "Arcade";

      switch (status.session.mode) {
        case "LOBBY": {
          status.session.mode = "Lobby";
          return "resources/status/Arcade-lobby-1.png";
        }

        case "PARTY": {
          status.session.mode = "Party Games";
          return "resources/status/Arcade-party-games-1.png";
        }

        case "HOLE_IN_THE_WALL": {
          status.session.mode = "Hole in the Wall";
          return "resources/status/Arcade-hole-in-the-wall-2.png";
        }

        case "THROW_OUT": {
          status.session.mode = "Throw Out";
          return "resources/status/Arcade-throw-out.png";
        }

        case "SOCCER": {
          status.session.mode = "Football";
          return "resources/status/Arcade-football.png";
        }

        case "ONEINTHEQUIVER": {
          status.session.mode = "Bounty Hunters";
          return "resources/status/Arcade-bounty-hunters-2.png";
        }

        case "DRAW_THEIR_THING": {
          status.session.mode = "Pixel Painters";
          return "resources/status/Arcade-pixel-painters.png";
        }

        case "DEFENDER": {
          status.session.mode = "Creeper Attack";
          return "resources/status/Arcade-creeper-attack.png";
        }

        case "DRAGONWARS2": {
          status.session.mode = "Dragon Wars";
          return "resources/status/Arcade-dragon-wars.png";
        }

        case "DAYONE": {
          status.session.mode = "Blocking Dead";
          return "resources/status/Arcade-blocking-dead.png";
        }

        case "STARWARS": {
          status.session.mode = "Galaxy Wars";
          return "resources/status/Arcade-galaxy-wars.png";
        }

        case "SIMON_SAYS": {
          status.session.mode = "Hypixel Says";
          return "resources/status/Arcade-hypixel-says.png";
        }

        case "ENDER": {
          status.session.mode = "Ender Spleef";
          return "resources/status/Arcade-ender-spleef.png";
        }

        case "FARM_HUNT": {
          status.session.mode = "Farm Hunt";

          switch (status.session.map) {
            case "Farm": {
              return "resources/status/Arcade-farm-hunt-4.png";
            }

            case "Meadow": {
              return "resources/status/Arcade-farm-hunt-3.png";
            }

            case "Homestead": {
              return "resources/status/Arcade-farm-hunt-1.png";
            }

            case "Beach Party": {
              return "resources/status/Arcade-farm-hunt-2.png";
            }
          }

          break;
        }

        case "ZOMBIES_DEAD_END": {
          status.session.mode = "Zombies";
          return "resources/status/Arcade-zombies-dead-end.png";
        }

        case "ZOMBIES_BAD_BLOOD": {
          status.session.mode = "Zombies";
          return "resources/status/Arcade-zombies-bad-blood.png";
        }

        case "ZOMBIES_ALIEN_ARCADIUM": {
          status.session.mode = "Zombies";
          return "resources/status/Arcade-zombies-alien-arcadium.png";
        }

        case "HIDE_AND_SEEK_PARTY_POOPER": {
          status.session.mode = "Party Pooper";

          switch (status.session.map) {
            case "Pool Party": {
              return "resources/status/Arcade-party-pooper-pool.png";
            }

            case "House Party": {
              return "resources/status/Arcade-party-pooper-house.png";
            }
          }

          break;
        }

        case "MINI_WALLS": {
          status.session.mode = "Mini Walls";

          return "resources/status/Arcade-mini-walls-babalon.png";
        }

        case "PVP_CTW": {
          status.session.mode = "Capture the Wool";

          switch (status.session.map) {
            case "Quabba": {
              return "resources/status/Arcade-capture-the-wool-5.png";
            }

            case "Amun": {
              return "resources/status/Arcade-capture-the-wool-6.png";
            }

            case "Desert Palace": {
              return "resources/status/Arcade-capture-the-wool-2.png";
            }

            case "Turrets": {
              return "resources/status/Arcade-capture-the-wool-7.png";
            }

            case "Tudor Garden": {
              return "resources/status/Arcade-capture-the-wool-3.png";
            }

            case "Manhattan Showdown": {
              return "resources/status/Arcade-capture-the-wool-8.png";
            }

            default: {
              return "resources/status/Arcade-capture-the-wool-6.png";
            }
          }
        }
      }
      return "resources/status/Arcade-lobby-1.png";
    }

    case "BEDWARS": {
      return "resources/status/Bedwars-lobby.png";
    }

    case "MCGO": {
      status.session.gameType = "Cops and Crims";
      return "resources/status/Cops-lobby.png";
    }

    case "LEGACY": {
      status.session.gameType = "Classic Games";

      switch (status.session.mode) {
        case "VAMPIREZ": {
          switch (status.session.map) {
            case "Plundered": {
              return "resources/status/Classic-vampirez-plundered.png";
            }
            case "Kudong": {
              return "resources/status/Classic-vampirez-kudong.png";
            }
            case "Village": {
              return "resources/status/Classic-vampirez-village.png";
            }
            case "Church": {
              return "resources/status/Classic-vampirez-village.png";
            }
          }

          return "resources/status/Classic-vampirez-kudong.png";
        }

        case "WALLS": {
          return "resources/status/Classic-walls-Aztec.png";
        }

        case "GINGERBREAD": {
          status.session.mode = "Turbo Kart Racers";
          return "resources/status/Classic-tkr.png";
        }

        case "PAINTBALL": {
          switch (status.session.map) {
            case "LaMente": {
              return "resources/status/Classic-paintball-LaMente.png";
            }
            case "Boletus": {
              return "resources/status/Classic-paintball-Boletus.png";
            }
            case "Market": {
              return "resources/status/Classic-paintball-Market.png";
            }
          }
          return "resources/status/Classic-paintball-LaMente.png";
        }
      }

      return "resources/status/Classic-lobby.png";
    }

    case "SKYWARS": {
      return "resources/status/Skywars-lobby.png";
    }

    case "MURDER_MYSTERY": {
      return "resources/status/Murder-mystery-lobby.png";
    }

    case "HOUSING": {
      return "resources/status/Housing-lobby.png";
    }

    case "PIT": {
      return "resources/status/Pit.png";
    }

    case "BUILD_BATTLE": {
      return "resources/status/Build-battle-lobby.png";
    }

    case "DUELS": {
      return "resources/status/Duels-lobby-new.png";
    }

    case "SPEED_UHC":
    case "UHC": {
      return "resources/status/UHC-lobby.png";
    }

    case "TNTGAMES": {
      status.session.gameType = "Tnt Games";
      return "resources/status/Tnt-lobby.png";
    }
  }

  return "resources/status/Main-lobby.png";
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
 * @param {string[]} args
 * @param {Message} rawmsg
 * @param {CommandInteraction} interaction
 * @returns {CommandResponse}
 */
async function callback(args, rawmsg, interaction) {
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
  }

  return new CommandResponse("", undefined, img.toDiscord());
}

export default new Command(["status", "sts"], ["*"], callback, 10000);
