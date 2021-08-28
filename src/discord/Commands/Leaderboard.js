const {
  MessageEmbed,
  Message,
  CommandInteraction
} = require("discord.js");
const BotRuntime = require("../BotRuntime");
const Command = require("../../classes/Command");
const logger = require("hyarcade-logger");
const getLB = require("../Utils/Leaderboards/GetLeaderboard");
const CustomLeaderboard = require("../Utils/Leaderboards/CustomLeaderboard");
const { ERROR_NO_LEADERBOARD } = require("../Utils/Embeds/StaticEmbeds");

module.exports = new Command("leaderboard", ["*"], hander);

/**
 * 
 * @param {string[]} args 
 * @param {Message} rawMsg 
 * @param {CommandInteraction} interaction 
 * @returns {object}
 */
async function hander (args, rawMsg, interaction) {
  // Start time before any packets are sent
  const startTime = Date.now();

  if(interaction != undefined && !interaction.isButton()) {
    logger.debug("Deferring interaction");
    await interaction.defer();
  }

  if(interaction.isButton()) {
    await interaction.deferUpdate();
  }

  const type = args[0];
  const limit = args[2] != undefined ? Number(args[2]) : 10;
  const startingIndex = args[3] != undefined ? Number(args[3]) : 0;
  const timetype = args[1] != undefined ? args[1] : "lifetime";

  let res = "";
  let gid = "";
  let gameName = "";

  switch(type.toLowerCase().trim()) {
  case "sex":
  case "sexy":
  case "party":
  case "partgam":
  case "party game":
  case "partygames":
  case "party games":
  case "pg": {
    gameName = "Party games";
    res = await getLB("wins", timetype, limit, "partyGames", startingIndex);
    gid = "pg";
    break;
  }

  case "fh":
  case "hot":
  case "farm":
  case "fmhnt":
  case "farmhunt":
  case "farm hunt":
  case "frmhnt": {
    gameName = "Farm hunt";
    res = await getLB("wins", timetype, limit, "farmhunt", startingIndex);
    gid = "fh";
    break;
  }

  case "fhp":
  case "fhpoop":
  case "poop":
  case "poopcollect":
  case "farmhuntpoop":
  case "farmhuntshit":
  case "shitcollected":
  case "poopcollected":
  case "fmhntpoop": {
    gameName = "Farm hunt poop";
    res = await getLB("poop", timetype, limit, "farmhunt", startingIndex);
    gid = "fhp";
    break;
  }

  case "hs":
  case "hsays":
  case "hypixel_says":
  case "hypixel says":
  case "hypixelsay":
  case "hypixelsays":
  case "hys":
  case "hypixel":
  case "says":
  case "hysays": {
    gameName = "Hypixel Says";
    res = await getLB("wins", timetype, limit, "hypixelSays", startingIndex);
    gid = "hs";
    break;
  }

  case "hitw":
  case "hit":
  case "hole":
  case "holeinthehole":
  case "woleinthehall":
  case "holeinthewall":
  case "holewall":
  case "wallhole":
  case "wally":
  case "speedbuilders":
  case "h.i.t.w.":
  case "pain": {
    gameName = "Hole in the wall";
    res = await getLB("wins", timetype, limit, "holeInTheWall", startingIndex);
    gid = "hitw";
    break;
  }

  case "mw":
  case "miw":
  case "mini":
  case "mwall":
  case "wall":
  case "pvp":
  case "miniwalls":
  case "mwwins": {
    gameName = "Mini walls";
    res = await getLB("wins", timetype, limit, "miniWalls", startingIndex);
    gid = "mw";
    break;
  }

  case "mwk":
  case "mwkills": {
    gameName = "Mini Walls Kills";
    res = await getLB("kills", timetype, limit, "miniWalls", startingIndex);
    gid = "mwk";
    break;
  }

  case "mwd":
  case "mwdeaths": {
    gameName = "Mini Walls Deaths";
    res = await getLB("deaths", timetype, limit, "miniWalls", startingIndex);
    gid = "mwd";
    break;
  }

  case "mwwd":
  case "mwwitherdmg": {
    gameName = "Mini Walls Wither Damage";
    res = await getLB("witherDamage", timetype, limit, "miniWalls", startingIndex);
    gid = "mwwd";
    break;
  }

  case "mwwk":
  case "mwwitherkills": {
    gameName = "Mini Walls Wither Kills";
    res = await getLB("witherKills", timetype, limit, "miniWalls", startingIndex);
    gid = "mwwk";
    break;
  }

  case "mwf":
  case "mwfinals": {
    gameName = "Mini Walls Final Kills";
    res = await getLB("finalKills", timetype, limit, "miniWalls", startingIndex);
    gid = "mwf";
    break;
  }

  case "sc":
  case "fb":
  case "foot":
  case "ballin":
  case "fuck":
  case "shit":
  case "football": {
    gameName = "Football";
    res = await getLB("wins", timetype, limit, "football", startingIndex);
    gid = "fb";
    break;
  }

  case "es":
  case "spleeg":
  case "ender":
  case "enderman":
  case "trash":
  case "enderspleef": {
    gameName = "Ender spleef";
    res = await getLB("wins", timetype, limit, "enderSpleef", startingIndex);
    gid = "es";
    break;
  }

  case "to":
  case "throw":
  case "toss":
  case "sumo2":
  case "throwout": {
    gameName = "Throw out";
    res = await getLB("wins", timetype, limit, "throwOut", startingIndex);
    gid = "to";
    break;
  }

  case "tok":
  case "sumokill":
  case "throwkills":
  case "tokills": {
    gameName = "Throw out kills";
    res = await getLB("kills", timetype, limit, "throwOut", startingIndex);
    gid = "tok";
    break;
  }

  case "gw":
  case "sw":
  case "galaxy":
  case "galaxywar":
  case "galawar":
  case "galaxywars": {
    gameName = "Galaxy wars";
    res = await getLB("wins", timetype, limit, "galaxyWars", startingIndex);
    gid = "gw";
    break;
  }

  case "dw":
  case "dragon":
  case "dragonwar":
  case "dragon war":
  case "fuckyousnoop":
  case "fuck you snoop":
  case "draggin":
  case "wagon":
  case "dwar":
  case "dawar":
  case "dragwar":
  case "dragonwars":
  case "dragon wars": {
    gameName = "Dragon wars";
    res = await getLB("wins", timetype, limit, "dragonWars", startingIndex);
    gid = "dw";
    break;
  }

  case "bh":
  case "bnt":
  case "one":
  case "oneinthequiver":
  case "bountyhunters": {
    gameName = "Bounty hunters";
    res = await getLB("wins", timetype, limit, "bountyHunters", startingIndex);
    gid = "bh";
    break;
  }

  case "bd":
  case "do":
  case "dayone":
  case "walkingdead":
  case "blocking":
  case "blockdie":
  case "blockdead":
  case "blockingdead": {
    gameName = "Blocking dead";
    res = await getLB("wins", timetype, limit, "blockingDead", startingIndex);
    gid = "bd";
    break;
  }

  case "arc":
  case "arcade":
  case "overall":
  case "all": {
    gameName = "Arcade wins";
    res = await getLB("arcadeWins", timetype, limit, undefined, startingIndex);
    gid = "arc";
    break;
  }

  case "has":
  case "hide":
  case "h&s":
  case "hns":
  case "probotkeptspammingthisshit":
  case "hideandseek":
  case "hidenseek":
  case "hideseek": {
    gameName = "Hide and seek";
    res = await getLB("wins", timetype, limit, "hideAndSeek", startingIndex);
    gid = "hns";
    break;
  }

  case "hnsk":
  case "hnskills":
  case "haskills":
  case "hidekills":
  case "hiderkills":
  case "seekerkills":
  case "hide and seek kills": {
    gameName = "Hide and seek kills";
    res = await getLB("kills", timetype, limit, "hideAndSeek", startingIndex);
    gid = "hnsk";
    break;
  }

  case "z":
  case "zs":
  case "zbs":
  case "zomb":
  case "zbies":
  case "zombies": {
    gameName = "Zombies";
    res = await getLB("wins_zombies", timetype, limit, "zombies", startingIndex);
    gid = "z";
    break;
  }

  case "ctw":
  case "capkills":
  case "ctkills":
  case "ctwkills": {
    gameName = "Capture the wool kills";
    res = await getLB("kills", timetype, limit, "captureTheWool", startingIndex);
    gid = "ctw";
    break;
  }

  case "ctww":
  case "ctwool":
  case "capwool":
  case "ctwwool":
  case "ctwcaps":
  case "woolcap":
  case "caps":
  case "captures":
  case "woolcaps":
  case "ctwwoolcaptured": {
    gameName = "Capture the wool captures";
    res = await getLB("woolCaptured", timetype, limit, "captureTheWool", startingIndex);
    gid = "ctww";
    break;
  }

  case "pp":
  case "draw":
  case "pixpaint":
  case "pixelpaint":
  case "pixelpainters":
  case "pixelpainter":
  case "drawmything":
  case "drawtheirthing":
  case "drawing": {
    gameName = "Pixel painters";
    res = await getLB("wins", timetype, limit, "pixelPainters", startingIndex);
    gid = "pp";
    break;
  }

  case "c":
  case "coins":
  case "acoins":
  case "arccoins":
  case "arcadecoins":
  case "arcade_coins": {
    gameName = "Arcade coins";
    res = await getLB("arcadeCoins", timetype, limit, undefined, startingIndex);
    gid = "c";
    break;
  }

  case "esim":
  case "eastsim":
  case "easter":
  case "eastersim":
  case "eastersimulator":
  case "easter-simulator": {
    gameName = "Easter simulator";
    res = await getLB("easter", timetype, limit, "seasonalWins", startingIndex);
    gid = "esim";
    break;
  }

  case "ssim":
  case "scuba":
  case "scubasim":
  case "scubasimulator":
  case "scuba-simulator": {
    gameName = "Scuba simulator";
    res = await getLB("scuba", timetype, limit, "seasonalWins", startingIndex);
    gid = "ssim";
    break;
  }

  case "hsim":
  case "hallow":
  case "halloween":
  case "halloweensim":
  case "halloweensimulator":
  case "halloween-simulator": {
    gameName = "Halloween simulator";
    res = await getLB("halloween", timetype, limit, "seasonalWins", startingIndex);
    gid = "hsim";
    break;
  }

  case "gsim":
  case "grinch":
  case "grinchsim":
  case "grinchsimulator":
  case "grinch-simulator": {
    gameName = "Grinch simulator";
    res = await getLB("grinch", timetype, limit, "seasonalWins", startingIndex);
    gid = "gsim";
    break;
  }

  case "sim":
  case "tsim":
  case "totalsim":
  case "totalsimulator":
  case "total-simulator": {
    gameName = "Total simulator";
    res = await getLB("total", timetype, limit, "seasonalWins", startingIndex);
    gid = "tsim";
    break;
  }

  case "ap":
  case "achieve":
  case "achievemnts":
  case "ach":
  case "advancements":
  case "advance":
  case "achiev": {
    gameName = "Achievement points";
    res = await getLB("achievementPoints", timetype, limit, undefined, startingIndex);
    gid = "ap";
    break;
  }

  case "bhk":
  case "bhkills":
  case "bountyhunterkills":
  case "bountykill":
  case "oitckills":
  case "bountyhuntkills": {
    gameName = "Bounty hunter kills";
    res = await getLB("kills", timetype, limit, "bountyHunters", startingIndex);
    gid = "bhk";
    break;
  }

  case "dwk":
  case "dwkills":
  case "dragonkills":
  case "dragwarkills":
  case "wagonkills":
  case "dragwarkil":
  case "dragonwarskills": {
    gameName = "Dragon wars kills";
    res = await getLB("kills", timetype, limit, "dragonWars", startingIndex);
    gid = "dwk";
    break;
  }

  case "fbg":
  case "fbgoals":
  case "goal":
  case "goals":
  case "fbgoal":
  case "footballg":
  case "soccergoals":
  case "footballgoals": {
    gameName = "Football goals";
    res = await getLB("goals", timetype, limit, "football", startingIndex);
    gid = "fbg";
    break;
  }

  case "gwk":
  case "gwkills":
  case "galaxykills":
  case "galawarkills":
  case "galakills":
  case "galaxywarkil":
  case "galaxywarskills": {
    gameName = "Galaxy wars kills";
    res = await getLB("kills", timetype, limit, "galaxyWars", startingIndex);
    gid = "gwk";
    break;
  }

  case "hiderwins":
  case "hwins":
  case "hnshwins":
  case "hnshiderwins": {
    gameName = "HNS hider wins";
    res = await getLB("hiderWins", timetype, limit, "hideAndSeek", startingIndex);
    gid = "hwins";
    break;
  }

  case "seekerwins":
  case "swins":
  case "hnsswins":
  case "hnsseekerwins": {
    gameName = "HNS seeker wins";
    res = await getLB("seekerWins", timetype, limit, "hideAndSeek", startingIndex);
    gid = "swins";
    break;
  }

  default: {
    if(type.trim().startsWith(".")) {
      gameName = type.trim().slice(1);
      
      let lb;

      try {
        lb = CustomLeaderboard(timetype, type, startingIndex, limit);
      } catch (e) {
        return { res: "", embed: ERROR_NO_LEADERBOARD };
      }

      gid = undefined;
      res = new MessageEmbed().setTitle(timetype)
        .setColor(0x00cc66)
        .setDescription(lb);
    } else {
      return {
        res: "",
        ERROR_NO_LEADERBOARD
      };
    }
  }
  }

  const finalRes = res
    .setAuthor(`${gameName} leaderboard`, BotRuntime.client.user.avatarURL());

  logger.debug(`Leaderboard command ran in ${Date.now() - startTime}ms`);


  // Use custom response since it gets fixed by the parser
  const response = {
    res: "",
    embed: finalRes,
    game: gid,
    start: startingIndex
  };

  return response;
}
