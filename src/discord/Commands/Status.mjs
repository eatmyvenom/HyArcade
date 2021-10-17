import { createRequire } from "module";
const require = createRequire(import.meta.url);

import Command from "../../classes/Command.js";
import Account from "hyarcade-requests/types/Account.js";
import ImageGenerator from "../images/ImageGenerator.js";
import InteractionUtils from "../interactions/InteractionUtils.js";
import CommandResponse from "../Utils/CommandResponse.js";
import { ERROR_UNLINKED } from "../Utils/Embeds/StaticEmbeds.js";
import TimeFormatter from "../Utils/Formatting/TimeFormatter.js";
import Requests from "hyarcade-requests";

const { CommandInteraction, Message } = require("discord.js");

const BORDER_COLOR = "#000000FF";
const BG_COLOR = "#444444CC";

/**
 * 
 * @param {object} status 
 * @returns {string}
 */
function getImage (status) {

  if(!status.session.online) {
    return "resources/status/Main-lobby.png";
  }

  switch (status.session.gameType) {
  case "ARCADE" : {

    status.session.gameType = "Arcade";

    switch (status.session.mode) {
    case "LOBBY" : {
      status.session.mode = "Lobby";
      return "resources/status/Arcade-lobby-1.png";
    }

    case "PARTY" : {
      status.session.mode = "Party Games";
      return "resources/status/Arcade-party-games-1.png";
    }

    case "HOLE_IN_THE_WALL" : {
      status.session.mode = "Hole in the Wall";
      return "resources/status/Arcade-hole-in-the-wall-2.png";
    }

    case "THROW_OUT" : {
      status.session.mode = "Throw Out";
      return "resources/status/Arcade-throw-out.png";
    }
    
    case "SOCCER" : {
      status.session.mode = "Football";
      return "resources/status/Arcade-football.png";
    }

    case "ONEINTHEQUIVER" : {
      status.session.mode = "Bounty Hunters";
      return "resources/status/Arcade-bounty-hunters-2.png";
    }

    case "DRAW_THEIR_THING" : {
      status.session.mode = "Pixel Painters";
      return "resources/status/Arcade-pixel-painters.png";
    }

    case "DEFENDER" : {
      status.session.mode = "Creeper Attack";
      return "resources/status/Arcade-creeper-attack.png";
    }

    case "DRAGONWARS2" : {
      status.session.mode = "Dragon Wars";
      return "resources/status/Arcade-dragon-wars.png";
    }

    case "DAYONE" : {
      status.session.mode = "Blocking Dead";
      return "resources/status/Arcade-blocking-dead.png";
    }

    case "STARWARS" : {
      status.session.mode = "Galaxy Wars";
      return "resources/status/Arcade-galaxy-wars.png";
    }

    case "SIMON_SAYS" : {
      status.session.mode = "Hypixel Says";
      return "resources/status/Arcade-hypixel-says.png";
    }

    case "ENDER" : {
      status.session.mode = "Ender Spleef";
      return "resources/status/Arcade-ender-spleef.png";
    }

    case "FARM_HUNT" : {
      status.session.mode = "Farm Hunt";

      switch (status.session.map) {
      case "Farm" : {
        return "resources/status/Arcade-farm-hunt-4.png";
      }

      case "Meadow" : {
        return "resources/status/Arcade-farm-hunt-3.png";
      }

      case "Homestead" : {
        return "resources/status/Arcade-farm-hunt-1.png";
      }

      case "Beach Party" : {
        return "resources/status/Arcade-farm-hunt-2.png";
      }
      }

      break;
    }

    case "ZOMBIES_DEAD_END" : {
      status.session.mode = "Zombies";
      return "resources/status/Arcade-zombies-dead-end.png";
    }

    case "ZOMBIES_BAD_BLOOD" : {
      status.session.mode = "Zombies";
      return "resources/status/Arcade-zombies-bad-blood.png";
    }

    case "ZOMBIES_ALIEN_ARCADIUM" : {
      status.session.mode = "Zombies";
      return "resources/status/Arcade-zombies-alien-arcadium.png";
    }

    case "HIDE_AND_SEEK_PARTY_POOPER" : {
      status.session.mode = "Party Pooper";

      switch (status.session.map) {
      case "Pool Party" : {
        return "resources/status/Arcade-party-pooper-pool.png";
      }

      case "House Party" : {
        return "resources/status/Arcade-party-pooper-house.png";
      }
      }

      break;
    }

    case "MINI_WALLS" : {
      status.session.mode = "Mini Walls";

      return "resources/status/Arcade-mini-walls-babalon.png";
    }

    case "PVP_CTW" : {
      status.session.mode = "Capture the Wool";

      switch (status.session.map) {

      case "Quabba" : {
        return "resources/status/Arcade-capture-the-wool-5.png";
      }

      case "Amun" : {
        return "resources/status/Arcade-capture-the-wool-6.png";
      }

      case "Desert Palace" : {
        return "resources/status/Arcade-capture-the-wool-2.png";
      }

      case "Turrets" : {
        return "resources/status/Arcade-capture-the-wool-7.png";
      }

      case "Tudor Garden" : {
        return "resources/status/Arcade-capture-the-wool-3.png";
      }

      case "Manhattan Showdown" : {
        return "resources/status/Arcade-capture-the-wool-8.png";
      }

      default : {
        return "resources/status/Arcade-capture-the-wool-6.png";
      }

      }
    }

    }
  }
  }

  return "resources/status/Main-lobby.png";
}

/**
 * @param {Account} acc
 * @returns {string}
 */
function lastSeen (acc) {
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
function loggedIn (acc) { 
  return TimeFormatter(acc.lastLogin);

}

/**
 * @param {string[]} args
 * @param {Message} rawmsg
 * @param {CommandInteraction} interaction
 * @returns {CommandResponse}
 */
async function callback (args, rawmsg, interaction) {
  let acc;

  if(interaction != undefined) {
    await interaction.defer();
    acc = await InteractionUtils.resolveAccount(interaction);
    if(acc == undefined) {
      return new CommandResponse("", ERROR_UNLINKED);
    }
  }

  const status = await Requests.HypixelApi.status(acc.uuid);
  const counts = await Requests.HypixelApi.counts();

  const modeOthers = counts?.games?.[status.session.gameType]?.modes?.[status.session.mode] ?? "Unknown";
  const typeOthers = counts?.games?.[status.session.gameType]?.players ?? "Unknown";

  const img = new ImageGenerator(1280, 800, "'myFont'");

  await img.addBackground(getImage(status), 0, 0, 1280, 800, "#0000002F");

  img.context.beginPath();
  img.context.rect(0, 56, 544, 56);
  img.context.fillStyle = BG_COLOR;
  img.context.fill();

  img.context.beginPath();
  img.context.rect(0, 56, 544, 56);
  img.context.strokeStyle = BORDER_COLOR;
  img.context.stroke();

  await img.writeText("-", 36, 84, "center", "#FFFFFFFF", "32px");
  await img.writeAcc(acc, 72, 84, "32px");

  if(status.session.online) {
    img.context.beginPath();
    img.context.rect(0, 168, 544, 56);
    img.context.fillStyle = BG_COLOR;
    img.context.fill();
    
    img.context.beginPath();
    img.context.rect(0, 168, 544, 56);
    img.context.strokeStyle = BORDER_COLOR;
    img.context.stroke();
    
    await img.writeText("-", 36, 196, "center", "#FFFFFFFF", "32px");
    await img.writeText(`Type : ${status.session.gameType}`, 72, 196, "left", "#55FF55", "32px");
    
    img.context.beginPath();
    img.context.rect(0, 280, 544, 56);
    img.context.fillStyle = BG_COLOR;
    img.context.fill();
    
    img.context.beginPath();
    img.context.rect(0, 280, 544, 56);
    img.context.strokeStyle = BORDER_COLOR;
    img.context.stroke();
    
    await img.writeText("-", 36, 154 * 2, "center", "#FFFFFFFF", "32px");
    await img.writeText(`Mode : ${status.session.mode}`, 72, 154 * 2, "left", "#55FFFF", "32px");

    img.context.beginPath();
    img.context.rect(736, 224, 544, 56);
    img.context.fillStyle = BG_COLOR;
    img.context.fill();
    
    img.context.beginPath();
    img.context.rect(736, 224, 544, 56);
    img.context.strokeStyle = BORDER_COLOR;
    img.context.stroke();

    await img.writeText("-", 736 + (36), 252, "center", "#FFFFFFFF", "32px");
    await img.writeText(`${status.session.gameType} : ${typeOthers}`, 736 + (72), 252, "left", "#55FF55", "32px");

    img.context.beginPath();
    img.context.rect(736, 336, 544, 56);
    img.context.fillStyle = BG_COLOR;
    img.context.fill();
    
    img.context.beginPath();
    img.context.rect(736, 336, 544, 56);
    img.context.strokeStyle = BORDER_COLOR;
    img.context.stroke();

    await img.writeText("-", 736 + (36), 182 * 2, "center", "#FFFFFFFF", "32px");
    await img.writeText(`${status.session.mode} : ${modeOthers}`, 736 + (72), 182 * 2, "left", "#55FFFF", "32px");

    img.context.beginPath();
    img.context.rect(0, 392, 544, 56);
    img.context.fillStyle = BG_COLOR;
    img.context.fill();
    
    img.context.beginPath();
    img.context.rect(0, 392, 544, 56);
    img.context.strokeStyle = BORDER_COLOR;
    img.context.stroke();

    await img.writeText("-", 36, 210 * 2, "center", "#FFFFFFFF", "32px");
    await img.writeText(`Map : ${status.session.map ?? status.session.mode}`, 72, 210 * 2, "left", "#FFFF55", "32px");

    img.context.beginPath();
    img.context.rect(0, 504, 544, 56);
    img.context.fillStyle = BG_COLOR;
    img.context.fill();
    
    img.context.beginPath();
    img.context.rect(0, 504, 544, 56);
    img.context.strokeStyle = BORDER_COLOR;
    img.context.stroke();

    await img.writeText("-", 36, 266 * 2, "center", "#FFFFFFFF", "32px");
    await img.writeText(`Login : ${loggedIn(acc)}`, 72, 266 * 2, "left", "#55FF55", "32px");
  } else {
    img.context.beginPath();
    img.context.rect(0, 168, 544, 56);
    img.context.fillStyle = BG_COLOR;
    img.context.fill();
    
    img.context.beginPath();
    img.context.rect(0, 168, 544, 56);
    img.context.strokeStyle = BORDER_COLOR;
    img.context.stroke();
    
    await img.writeText("-", 36, 196, "center", "#FFFFFFFF", "32px");
    await img.writeText(`Logout : ${lastSeen(acc)}`, 72, 196, "left", "#55FF55", "32px");

    img.context.beginPath();
    img.context.rect(0, 280, 544, 56);
    img.context.fillStyle = BG_COLOR;
    img.context.fill();
    
    img.context.beginPath();
    img.context.rect(0, 280, 544, 56);
    img.context.strokeStyle = BORDER_COLOR;
    img.context.stroke();
    

    let game = acc.mostRecentGameType;
    game = `${game.slice(0, 1).toUpperCase()}${game.slice(1).toLowerCase()}`.replace(/_/g, " ");

    await img.writeText("-", 36, 154 * 2, "center", "#FFFFFFFF", "32px");
    await img.writeText(`Last Mode : ${game}`, 72, 154 * 2, "left", "#55FFFF", "32px");
  }


  return new CommandResponse("", undefined, img.toDiscord());
}




export default new Command("status", ["*"], callback, 10000);